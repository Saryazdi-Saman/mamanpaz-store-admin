import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    console.log("GET STORE PLANS API")
    const {
        data: plans,
    } = await query.graph({
        entity: "price_tiers",
        fields: [
            "id",
            "name",
            "meals_per_day",
            "meals_per_week",
            "price_per_meal",
            "product_variant.id",
        ],
        pagination: {
            skip: 0,
            order: {
                meals_per_day: "ASC"
            }
        }
        
    })
    res.json({
        plans: plans,
    })
}