import { MedusaService } from "@medusajs/framework/utils"
import { Guest } from "./models/guest"
import crypto from "crypto"

class GuestModuleService extends MedusaService({
  Guest,
}) {
  async createNewGuest(): Promise<any> {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    return await this.createGuests({
      token: token,
      expires_at: expiresAt,
     })
  }
}

export default GuestModuleService