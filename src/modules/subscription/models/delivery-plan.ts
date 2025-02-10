import { model } from "@medusajs/framework/utils";
import Plan from "./plan";

const DeliveryPlan = model.define("delivery_plan", {
    id: model.id().primaryKey(),
    title: model.text(),
    day1: model.number().default(0),
    day2: model.number().default(0),
    day3: model.number().default(0),
    day4: model.number().default(0),
    day5: model.number().default(0),
    day6: model.number().default(0),
    day7: model.number().default(0),
    plans: model.hasMany(() => Plan, {
        mappedBy: "delivery_schedule"
    }),
})

export default DeliveryPlan