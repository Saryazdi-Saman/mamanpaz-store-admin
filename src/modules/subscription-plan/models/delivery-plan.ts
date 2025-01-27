import { model } from "@medusajs/framework/utils";

const DeliveryPlan = model.define("delivery_plan", {
    id: model.id().primaryKey(),
    name: model.text(),
    slug: model.text().unique(),
    is_active: model.boolean().default(true),
    price: model.bigNumber(),
    monday: model.number().default(0),
    tuesday: model.number().default(0),
    wednesday: model.number().default(0),
    thursday: model.number().default(0),
    friday: model.number().default(0),
    saturday: model.number().default(0),
    sunday: model.number().default(0),
})

export default DeliveryPlan