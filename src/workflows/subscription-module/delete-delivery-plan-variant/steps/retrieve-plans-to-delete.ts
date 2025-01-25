import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import DeliveryPlanVariantLink from "src/links/delivery-plan-product-variant"
import { Modules } from "@medusajs/framework/utils"

type RetrieveDeliveryPlansToDeleteStepInput = {
    variant_id: string
}

export const retrieveDeliveryPlansToDeleteStep = createStep(
    "retrieve-delivery-plans-to-delete-step",
    async ({ variant_id }: RetrieveDeliveryPlansToDeleteStepInput, { container }) => {
        const productService = container.resolve(Modules.PRODUCT);
        const query = container.resolve("query")

        const { data } = await query.graph({
            entity: DeliveryPlanVariantLink.entryPoint,
            fields: ["delivery_plan.*"],
            filters: {
                product_variant_id: variant_id,
            },
        })

        const deliveryPlanIds = data.map((d) => d.delivery_plan)

        return new StepResponse(deliveryPlanIds)

    }
)