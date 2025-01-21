import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SubscriptionPlanModule from "src/modules/subscription-plan";

export default defineLink(
    {
        linkable: SubscriptionPlanModule.linkable.planCategory,
        deleteCascade: true,
    },
    ProductModule.linkable.product,
)