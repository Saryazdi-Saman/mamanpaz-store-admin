import ProductModule from "@medusajs/medusa/product";
import SubscriptionPlanModule from "../modules/subscription";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
    {
        linkable: SubscriptionPlanModule.linkable.plan,
        deleteCascade: true
    },
    ProductModule.linkable.productVariant,
)