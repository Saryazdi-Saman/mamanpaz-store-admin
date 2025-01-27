import { model } from "@medusajs/framework/utils";
import PlanCategory from "./plan-category";

const PriceTier = model.define("price_tier", {
    id: model.id().primaryKey(),
    name: model.text(),
    slug: model.text().unique(),
    meals_per_week: model.number(),
    meals_per_day: model.number(),
    price_per_meal: model.bigNumber(),
    category: model.belongsTo(() => PlanCategory, {
        mappedBy: "price_tiers",
    }),
})

export default PriceTier