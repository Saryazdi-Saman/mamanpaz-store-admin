import { model } from "@medusajs/framework/utils";
import PriceTier from "./plan";

const PlanCategory = model.define("plan_category", {
    id: model.id().primaryKey(),
    name: model.text(),
    is_active: model.boolean().default(true),
    plans: model.hasMany(() => PriceTier, {
        mappedBy: "category"
    }),
})
.cascades({
    delete: ["plans"],
})

export default PlanCategory