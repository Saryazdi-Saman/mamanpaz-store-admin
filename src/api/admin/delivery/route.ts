import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createDeliveryPlanSchema } from "src/api/validation-schemas";
import createDeliveryPlanWorkflow from "src/workflows/subscription-module/create-delivery-plan";
import z from "zod";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: deliveryPlans,
    } = await query.graph({
        entity: "delivery_plan",
        fields: [
            "*",
        ],
    })
    res.json({
        data: deliveryPlans,
    })
}

type PostRequestBody = z.infer<
    typeof createDeliveryPlanSchema
>

export const POST = async (
    req: AuthenticatedMedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    const { result } = await createDeliveryPlanWorkflow(
        req.scope
    ).run({
        input: {
            name: req.validatedBody.name,
            day_one: req.validatedBody.day_one,
            day_two: req.validatedBody.day_two,
            day_three: req.validatedBody.day_three,
            day_four: req.validatedBody.day_four,
            day_five: req.validatedBody.day_five,
            day_six: req.validatedBody.day_six,
            day_seven: req.validatedBody.day_seven,
        }
    })

    res.json({
        success: true
    })
}