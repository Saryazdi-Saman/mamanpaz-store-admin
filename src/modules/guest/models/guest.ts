import { model } from "@medusajs/framework/utils"
import { OnboardingStage } from "../types"
import { StageHistory } from "./stage-history"
import { UTMVisit } from "./utm-visit"

export const Guest = model.define("guest", {
  id: model.id().primaryKey(),
  current_stage: model.text().default(OnboardingStage.INITIAL).index("GUEST_CURRENT_STAGE"),
  phone_number: model.text().nullable(),
  phone_verified: model.boolean().default(false),
  email: model.text().nullable(),
  password: model.text().nullable(),
  name: model.text().nullable(),
  last_name: model.text().nullable(),
  address_line1: model.text().nullable(),
  address_line2: model.text().nullable(),
  address_line3: model.text().nullable(),
  city: model.text().nullable(),
  province: model.text().nullable(),
  postal_code: model.text().nullable(),
  country: model.text().nullable(),
  neighborhood: model.text().nullable(),
  region: model.text().nullable(),
  district: model.text().nullable(),
  expires_at: model.dateTime(),
  phone_verification_code: model.text().nullable(),
  last_active_at: model.dateTime().index("GUEST_LAST_ACTIVE_AT"),
  token: model.text().unique().index("GUEST_TOKEN"),
  
  process_history: model.hasMany(() => StageHistory, {
    mappedBy: "guest",
  }),
  visits: model.hasMany(() => UTMVisit, {
    mappedBy: "guest",
  }),
})