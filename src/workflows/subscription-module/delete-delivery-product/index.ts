import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { retrieveDeliveryPlansToDeleteStep } from "./steps/retrieve-plans-to-delete"
import { deleteDeliveryPlansStep } from "./steps/delete-delivery-plans"

type DeleteVariantDeliveryPlansInput = {
    id: string
}

const deleteDeliveryProductWorkflow = createWorkflow(
    "delete-delivery-product-workflow",
    (input : DeleteVariantDeliveryPlansInput) => {
        const deliveryPlansToDelete = retrieveDeliveryPlansToDeleteStep({
            product_id: input.id
        })

        deleteDeliveryPlansStep({
            ids: deliveryPlansToDelete
        })

        return new WorkflowResponse({})
    }
)

export default deleteDeliveryProductWorkflow