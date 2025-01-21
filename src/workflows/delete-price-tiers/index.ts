import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { retrieveProductToDeleteInput } from "./steps/retrieve-products-to-delete"

type DeletePriceTiersWorkflowInput = {
    plan_category_id: string
}

export const deletePlanCategoryWorkflow = createWorkflow(
    "delete-plan-category-workflow",
    (input : DeletePriceTiersWorkflowInput) => {
        const productToDelete = retrieveProductToDeleteInput({
            plan_category_id: input.plan_category_id,
        })
        return new WorkflowResponse({})
    }
)