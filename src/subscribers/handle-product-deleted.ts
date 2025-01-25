import { SubscriberConfig } from "@medusajs/framework";
import deleteDeliveryProductWorkflow from "src/workflows/subscription-module/delete-delivery-product";

export default async function handleProductDeleted({
    event: { data },
    container,
}) {
    await deleteDeliveryProductWorkflow(container)
        .run({
            input: data,
        })
}

export const config: SubscriberConfig = {
    event: "product.deleted",
}