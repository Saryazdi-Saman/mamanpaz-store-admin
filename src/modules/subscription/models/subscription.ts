import { model } from "@medusajs/framework/utils";
import { SubscriptionStatus } from "../types";
import Plan from "./plan";
import BoxTemplate from "./box-template";

const Subscription = model.define("subscription", {
    id: model.id().primaryKey(),
    status: model.enum(SubscriptionStatus).default(SubscriptionStatus.ACTIVE),
    extra_meals: model.number().default(0),
    start_date: model.dateTime(),
    next_order_date: model.dateTime().index().nullable(),
    pause_until_date: model.dateTime().nullable(),
    failed_payment_attempts: model.number().default(0),
    cancellation_date: model.dateTime().nullable(),
    cancellation_reason: model.text().nullable(),
    metadata: model.json().nullable(),
    plan: model.belongsTo(() => Plan, {
        mappedBy: "subscriptions",
    }),
    box_templates: model.hasMany(()=> BoxTemplate, {
        mappedBy: "subscription"
    })
})

export default Subscription