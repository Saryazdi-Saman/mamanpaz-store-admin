import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deletePlanCategoryWorkflow } from "src/workflows/delete-price-tiers"

type PostRequestBody = {
    id: string
}

export const POST = async (
    req: AuthenticatedMedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    console.log("DELETE REQUEST RECIEVED")
    console.log(req.body)
    await deletePlanCategoryWorkflow(
        req.scope
    ).run({
        input: {
            plan_category_id: req.body.id,
        }
    })
    res.json({
        success: true,
    })
}