import { model } from "@medusajs/framework/utils";

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
})

export default DeliveryPlan