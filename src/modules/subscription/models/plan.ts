import { model } from "@medusajs/framework/utils";
import PlanCategory from "./plan-category";
import DeliveryPlan from "./delivery-plan";
import Subscription from "./subscription";

const Plan = model.define("plan", {
    id: model.id().primaryKey(),
    name: model.text(),
    slug: model.text().unique(),
    customer_group_name: model.text().unique(),
    meals_per_week: model.number(),
    meals_per_day: model.number(),
    price_per_meal: model.bigNumber(),
    category: model.belongsTo(() => PlanCategory, {
        mappedBy: "plans",
    }),
    delivery_schedule: model.belongsTo(() => DeliveryPlan, {
        mappedBy: "plans",
    }),
    subscriptions: model.hasMany(() => Subscription, {
        mappedBy: "plan",
    })
})

export default Plan