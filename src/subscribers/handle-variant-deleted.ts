import { SubscriberConfig } from "@medusajs/framework";
import { deleteVariantDeliveryPlansWorkflow } from "src/workflows/delete-delivery-plan";

export default async function handleProductVariantDeleted({
    event: { data },
    container,
}) {
    await deleteVariantDeliveryPlansWorkflow(container)
        .run({
            input: data,
        })
}

export const config: SubscriberConfig = {
    event: "product-variant.deleted",
}