import { model } from "@medusajs/framework/utils";
import { UTMVisit } from "./utm-visit";

export const UtmSource = model.define("utm_source", {
    id: model.id().primaryKey(),
    name: model.text(),
    campaign_name: model.text(),
    source: model.text(),
    medium: model.text(),
    content: model.text().nullable(),
    term: model.text().nullable(),
    short_path: model.text().unique(),
    destination_url: model.text().nullable(),
    visits: model.hasMany(() => UTMVisit, {
        mappedBy: "utm_source",
    }),
})