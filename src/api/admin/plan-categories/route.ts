import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

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
            "plans.*",
        ],
        filters: {
            id: req.body.id
        }
    })

    res.json({
        plans: planCategories[0].plans,
    })
}