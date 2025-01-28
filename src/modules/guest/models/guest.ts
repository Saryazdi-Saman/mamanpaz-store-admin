import { model } from "@medusajs/framework/utils"
import { OnboardingStage } from "../types"
import { StageHistory } from "./stage-history"
import { UTM } from "./utm"

export const Guest = model.define("guest", {
  id: model.id().primaryKey(),
  current_stage: model.text().default(OnboardingStage.INITIAL).index("GUEST_CURRENT_STAGE"),
  phone_number: model.text().nullable(),
  phone_verified: model.boolean().default(false),
  email: model.text().nullable(),
  password: model.text().nullable(),
  name: model.text().nullable(),
  last_name: model.text().nullable(),
  address: model.text().nullable(),
  city: model.text().nullable(),
  expires_at: model.dateTime(),
  last_active_at: model.dateTime().index("GUEST_LAST_ACTIVE_AT"),
  phone_verification_code: model.text().nullable(),
  token: model.text().unique().index("GUEST_TOKEN"),
  
  process_history: model.hasMany(() => StageHistory, {
    mappedBy: "guest",
  }),
  utm: model.hasMany(() => UTM, {
    mappedBy: "guest",
  }),
})