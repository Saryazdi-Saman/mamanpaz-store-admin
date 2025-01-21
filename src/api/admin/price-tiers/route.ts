import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createPriceTierSchema } from "src/api/validation-schemas";
import createPriceTiersWorkflow from "src/workflows/create-price-tiers.ts";
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
        data: priceTiers,
    } = await query.graph({
        entity: "price_tiers",
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
        price_tiers: priceTiers,
    })
}

type PostRequestBody = z.infer<
    typeof createPriceTierSchema
>

export const POST = async (
    req: AuthenticatedMedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    console.log("POST REQUEST RECIEVED")
    console.log(req.body)
    const price_tiers = req.validatedBody.price_tiers.map((price_tier) => ({
        ...price_tier,
        meals_per_week: price_tier.meals_per_day * 7,
    }))
    console.log("PRICE TIERS")
    console.log(price_tiers)
    const { result } = await createPriceTiersWorkflow(
        req.scope
    ).run({
        input: {
            name: req.validatedBody.name,
            price_tiers: price_tiers,
        }
    })
    
    res.json({
        result
    })
}