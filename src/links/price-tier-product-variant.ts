import ProductModule from "@medusajs/medusa/product";
import SubscriptionPlanModule from "../modules/subscription-plan";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
    {
        linkable: SubscriptionPlanModule.linkable.priceTier,
        deleteCascade: true
    },
    ProductModule.linkable.productVariant,
)