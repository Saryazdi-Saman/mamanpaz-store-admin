import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import DeliveryPlanVariantLink from "src/links/delivery-plan-product-variant"
import { Modules } from "@medusajs/framework/utils"

type RetrieveDeliveryPlansToDeleteStepInput = {
    product_id: string
}

export const retrieveDeliveryPlansToDeleteStep = createStep(
    "retrieve-delivery-plans-to-delete-step",
    async ({ product_id }: RetrieveDeliveryPlansToDeleteStepInput, { container }) => {
        const productService = container.resolve(Modules.PRODUCT);
        const query = container.resolve("query")

        const productVariants = await productService.listProductVariants({
            product_id,
        }, {
            withDeleted: true,
        })

        const { data } = await query.graph({
            entity: DeliveryPlanVariantLink.entryPoint,
            fields: ["delivery_plan.*"],
            filters: {
                product_variant_id: productVariants.map((v) => v.id),
            },
        })

        const deliveryPlanIds = data.map((d) => d.delivery_plan)

        return new StepResponse(deliveryPlanIds)

    }
)