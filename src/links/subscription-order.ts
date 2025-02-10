import { defineLink } from "@medusajs/framework/utils";
import OrderModule from "@medusajs/medusa/order";
import SubscriptionModule from "src/modules/subscription";

export default defineLink(
    SubscriptionModule.linkable.subscription,
    {
        linkable: OrderModule.linkable.order,
        isList: true
    }
)