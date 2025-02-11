import { model } from "@medusajs/framework/utils";
import Subscription from "./subscription";
import { DayOfWeek } from "../types";

const BoxTemplate = model.define("box_template", {
    id: model.id().primaryKey(),
    shipping_day: model.enum(DayOfWeek),
    meals: model.number(),
    sides: model.number().default(0),
    desserts: model.number().default(0),
    drinks: model.number().default(0),
    other: model.json().nullable(),
    metadata: model.json().nullable(),
    subscription: model.belongsTo(() => Subscription, {
        mappedBy: "box_templates"
    })
})

export default BoxTemplate