import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import SubscriptionModule from "src/modules/subscription";

export default defineLink(
    SubscriptionModule.linkable.subscription,
    CustomerModule.linkable.customer
)