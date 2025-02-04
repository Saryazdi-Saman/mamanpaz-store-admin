import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const promotionsModule = req.scope.resolve(Modules.PROMOTION)
    const today = new Date()
    const validCampaigns = await promotionsModule.listCampaigns(
        {
            ends_at: {
                $gt: today,
            }
        },
        {
            relations: ["promotions"]
        }
    )
    res.json({
        data: validCampaigns,
    })
}
