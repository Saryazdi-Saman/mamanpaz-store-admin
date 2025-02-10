import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createPriceTierSchema } from "src/api/validation-schemas";
import createPriceTiersWorkflow from "src/workflows/subscription-module/create-price-tiers";
import { z } from "zod";

type GetRequestBody = {
    ids: string[]
}

export const GET = async (
    req: AuthenticatedMedusaRequest<GetRequestBody>,
    res: MedusaResponse
) => {
    const {
        fields,
        limit = 20,
        offset = 0,
    } = req.validatedQuery || {}

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
        data: plans,
    } = await query.graph({
        entity: "plans",
        fields: [
            "*",
            ...(fields || []),
        ],
        filters: {
            id: req.body.ids
        },
        pagination: {
            skip: offset,
            take: limit,
        },
    })

    res.json({
        plans: plans,
    })
}

type PostRequestBody = z.infer<
    typeof createPriceTierSchema
>

export const POST = async (
    req: AuthenticatedMedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    console.log("POST API: request")
    console.log(req.body)
    const price_tiers = req.body.price_tiers.map((price_tier) => ({
        ...price_tier,
        meals_per_week: price_tier.meals_per_day * 7,
    }))
    const { result } = await createPriceTiersWorkflow(
        req.scope
    ).run({
        input: {
            name: req.body.name,
            price_tiers: price_tiers,
        }
    })
    
    res.json({
        result
    })
}