import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createDeliveryPlanSchema } from "src/api/validation-schemas";
import createDeliveryPlanWorkflow from "src/workflows/subscription-module/create-delivery-plan";
import z from "zod";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    console.log("GET REQUEST RECIEVED")
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: deliveryPlans,
    } = await query.graph({
        entity: "delivery_plan",
        fields: [
            "*",
            "product_variant.id",
            "product_variant.product_id",
        ],
    })
    console.log("deliveryPlans", deliveryPlans)
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
            slug: req.validatedBody.slug,
            price: req.validatedBody.price,
            monday: req.validatedBody.monday,
            tuesday: req.validatedBody.tuesday,
            wednesday: req.validatedBody.wednesday,
            thursday: req.validatedBody.thursday,
            friday: req.validatedBody.friday,
            saturday: req.validatedBody.saturday,
            sunday: req.validatedBody.sunday,
        }
    })

    res.json({
        success: true
    })
}