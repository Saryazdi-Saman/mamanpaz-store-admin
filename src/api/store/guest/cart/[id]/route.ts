import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { addToCartWorkflow, deleteLineItemsWorkflow } from "@medusajs/medusa/core-flows";
import { OnboardingStage } from "src/modules/guest/types";
import updateGuestWorkflow from "src/workflows/guest-module/update-guest";

type PostRequestBody = {
    token: string
    meal_plan_variant: string
    delivery_schedule_variant: string
}

export const POST = async (
    req: MedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    const cart_id = req.params.id

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
        entity: "cart",
        fields: [
            "items.id",
            "items.product_type"
        ],
        filters: {
            id: cart_id
        }
    })
    if (data && data.length > 0) {
        const deletableItems = data[0].items
            .filter((item) => item?.product_type === "meal-plan" || item?.product_type === "delivery-plan")
            .map((item) => item?.id as string)

        await deleteLineItemsWorkflow(req.scope)
            .run({
                input: {
                    cart_id: cart_id,
                    ids: deletableItems
                }
            })
    }
    const { result, errors } = await addToCartWorkflow(req.scope)
        .run({
            input: {
                cart_id: cart_id,
                items: [
                    {
                        variant_id: req.body.meal_plan_variant,
                        quantity: 1,
                    },
                    {
                        variant_id: req.body.delivery_schedule_variant,
                        quantity: 1,
                    },
                ],
            },
        })
    if (errors && errors.length > 0) {
        res.status(400).json({
            message: "Guest cart creation failed",
            errors: errors
        })
    }
    await updateGuestWorkflow(req.scope)
        .run({
            input: {
                token: req.body.token,
                next_stage: OnboardingStage.CREDENTIALS,
                updates: {
                    last_active_at: new Date(Date.now()),
                }
            }})
    res.json({
        message: "Guest cart created",
    })
}