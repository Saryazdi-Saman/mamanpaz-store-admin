import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createPriceTierSchema } from "src/api/validation-schemas";
import createPriceTiersWorkflow from "src/workflows/subscription-module/create-price-tiers";
import { z } from "zod";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: planCategories,
    } = await query.graph({
        entity: "plan_category",
        fields: [
            "*",
            "product.id",
        ],
    })
    res.json({
        plan_categories: planCategories,
    })
}

type PostRequestBody = {
    id: string
}

export const POST = async (
    req: AuthenticatedMedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
        data: planCategories,
    } = await query.graph({
        entity: "plan_category",
        fields: [
            "*",
            "price_tiers.*",
        ],
        filters: {
            id: req.body.id
        }
    })

    res.json({
        price_tiers: planCategories[0].price_tiers,
    })
}