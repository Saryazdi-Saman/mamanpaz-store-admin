import { model } from "@medusajs/framework/utils";
import { Guest } from "./guest";
import { UTMVisit } from "./utm-visit";

export const UTMSource = model.define("utm_source", {
    id: model.id().primaryKey(),
    name: model.text(),
    source: model.text(),
    medium: model.text(),
    campaign: model.text(),
    content: model.text().nullable(),
    term: model.text().nullable(),
    short_path: model.text().unique(),
    destination_url: model.text().nullable(),
    visits: model.hasMany(() => UTMVisit, {
        mappedBy: "utm_source",
    }),
})