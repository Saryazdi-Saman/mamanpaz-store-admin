import { MedusaService } from "@medusajs/framework/utils"
import { QrLink } from "./models/qr-link"

class MarketingModuleService extends MedusaService({
  QrLink,
}) {

}

export default MarketingModuleService