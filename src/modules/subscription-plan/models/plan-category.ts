import { model } from "@medusajs/framework/utils";
import PriceTier from "./price-tier";

const PlanCategory = model.define("plan_category", {
    id: model.id().primaryKey(),
    name: model.text(),
    is_active: model.boolean().default(true),
    price_tiers: model.hasMany(() => PriceTier, {
        mappedBy: "category"
    }),
})
.cascades({
    delete: ["price_tiers"],
})

export default PlanCategory