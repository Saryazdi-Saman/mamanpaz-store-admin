import { Module } from "@medusajs/framework/utils";
import SubscriptionModule from "./service";

export const SUBSCRIPTION_MODULE = "subscriptionModule";

export default Module(SUBSCRIPTION_MODULE, {
    service: SubscriptionModule
})