import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import planCategoryProductLink  from "src/links/plan-category-product"

type RetrieveProductToDeleteInput = {
    plan_category_id: string
}

export const retrieveProductToDeleteInput = createStep(
    "retrieve-product-to-delete-input",
    async ({plan_category_id}: RetrieveProductToDeleteInput, { container }) => {
        console.log("DELETE WORKFLOW STARTED")
        const productModuleService = container.resolve(Modules.PRODUCT);
        const query = container.resolve(ContainerRegistrationKeys.QUERY)

        const data= await query.graph({
            entity: planCategoryProductLink.entryPoint,
            fields: [
                "*",
            ],
            // filters: {
            //     plan_category_id,
            // },
        })
        console.log("DELETE WORKFLOW")
        console.log(data)
        // const product_id = data[0].product.id
        return new StepResponse()
    }
)