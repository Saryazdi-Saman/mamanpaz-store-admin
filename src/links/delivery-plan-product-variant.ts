import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import SubscriptionPlanModuleService from "src/modules/subscription-plan";

export default defineLink(
    {
        linkable: SubscriptionPlanModuleService.linkable.deliveryPlan,
        deleteCascade: true,
    },
    ProductModule.linkable.productVariant,
)