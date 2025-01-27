import { model } from "@medusajs/framework/utils";
import { Guest } from "./guest";

export const UTM = model.define("utm", {
    id: model.id().primaryKey(),
    source: model.text(),
    medium: model.text().nullable(),
    campaign: model.text().nullable(),
    term: model.text().nullable(),
    content: model.text().nullable(),
    guest: model.belongsTo(() => Guest, {
        mappedBy: "utm",
    }),
})