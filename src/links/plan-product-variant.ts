import ProductModule from "@medusajs/medusa/product";
import SubscriptionModule from "../modules/subscription";
import { defineLink } from "@medusajs/framework/utils";

export default defineLink(
    {
        linkable: SubscriptionModule.linkable.plan,
        deleteCascade: true
    },
    ProductModule.linkable.productVariant,
)