import { MedusaService } from "@medusajs/framework/utils"
import { Guest } from "./models/guest"
import crypto from "crypto"
import { StageHistory } from "./models/stage-history"
import { Visit } from "./models/visit"

class GuestModuleService extends MedusaService({
  Guest,
  Visit,
  StageHistory,
}) {
  async createNewGuest(): Promise<any> {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const last_active_at = new Date(Date.now())
    return await this.createGuests({
      token: token,
      expires_at: expiresAt,
      last_active_at: last_active_at,
     })
  }
}

export default GuestModuleService