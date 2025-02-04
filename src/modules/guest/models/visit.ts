import { model } from "@medusajs/framework/utils";
import { Guest } from "./guest";

export const Visit = model.define("visit", {
    id: model.id().primaryKey(),
    ip_address: model.text().nullable(),
    user_agent: model.text().nullable(),
    referer: model.text().nullable(),
    origin: model.text().nullable(),
    utm_source: model.text().nullable(),
    utm_medium: model.text().nullable(),
    utm_campaign: model.text().nullable(),
    utm_content: model.text().nullable(),
    utm_term: model.text().nullable(),
    guest: model.belongsTo(() => Guest, {
        mappedBy: "visits",
    }),
})