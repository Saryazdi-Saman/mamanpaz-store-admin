import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SubscriptionPlanModule from "src/modules/subscription";

export default defineLink(
    {
        linkable: SubscriptionPlanModule.linkable.deliveryPlan,
        deleteCascade: true,
    },
    ProductModule.linkable.productVariant,
)