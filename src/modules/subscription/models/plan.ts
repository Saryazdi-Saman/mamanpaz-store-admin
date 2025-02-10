import { model } from "@medusajs/framework/utils";
import PlanCategory from "./plan-category";
import DeliveryPlan from "./delivery-plan";

const Plan = model.define("plan", {
    id: model.id().primaryKey(),
    name: model.text(),
    slug: model.text().unique(),
    meals_per_week: model.number(),
    meals_per_day: model.number(),
    price_per_meal: model.bigNumber(),
    category: model.belongsTo(() => PlanCategory, {
        mappedBy: "plans",
    }),
    delivery_schedule: model.belongsTo(() => DeliveryPlan, {
        mappedBy: "plans",
    }),
})

export default Plan