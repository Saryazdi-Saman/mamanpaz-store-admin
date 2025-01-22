import { model } from "@medusajs/framework/utils"

export const Guest = model.define("guest", {
  id: model.id().primaryKey(),
  phone_number: model.text().nullable(),
  phone_verified: model.boolean().default(false),
  email: model.text().nullable(),
  password: model.text().nullable(),
  name: model.text().nullable(),
  last_name: model.text().nullable(),
  address: model.text().nullable(),
  city: model.text().nullable(),
  expires_at: model.dateTime(),
  token: model.text().unique().index("GUEST_TOKEN"),
})