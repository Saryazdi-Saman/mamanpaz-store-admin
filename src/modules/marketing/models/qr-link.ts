import { model } from "@medusajs/framework/utils"

export const QrLink = model.define("qr-link", {
    id: model.id().primaryKey(),
    link: model.text().unique(),
    name: model.text(),
    campaign_name: model.text(),
    source: model.text(),
    medium: model.text(),
    content: model.text().nullable(),
    term: model.text().nullable(),
    destination_url: model.text().default("/"),
    visits: model.number().default(0),
})