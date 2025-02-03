import { model } from "@medusajs/framework/utils";
import { Guest } from "./guest";
import { UTMSource } from "./utm-source";

export const UTMVisit = model.define("utm_visit", {
    id: model.id().primaryKey(),
    ip_address: model.text().nullable(),
    user_agent: model.text().nullable(),
    referrer: model.text().nullable(),
    guest: model.belongsTo(() => Guest, {
        mappedBy: "visits",
    }),
    utm_source: model.belongsTo(() => UTMSource, {
        mappedBy: "visits",
    }),
})