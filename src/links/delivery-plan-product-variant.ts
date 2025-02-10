import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SubscriptionModule from "src/modules/subscription";

export default defineLink(
    {
        linkable: SubscriptionModule.linkable.deliveryPlan,
        deleteCascade: true,
    },
    ProductModule.linkable.productVariant,
)