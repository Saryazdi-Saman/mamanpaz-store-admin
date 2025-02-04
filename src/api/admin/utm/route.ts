import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CreateCampaignSchema } from "src/admin/validation-schemas"
import { GUEST_MODULE } from "src/modules/guest"
import z from "zod"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: utmSources,
    } = await query.graph({
        entity: "utm_source",
        fields: [
            "*",
        ],
    })
    console.log("utmSources", utmSources)
    res.json({
        data: utmSources,
    })
}
type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateCampaignInput>,
    res: MedusaResponse
) => {
    const guestModule = req.scope.resolve(GUEST_MODULE)
    
    try {
        const createdUtm = await guestModule.createUtmSources({
            name: req.body.name,
            campaign_name: req.body.campaign,
            medium: req.body.medium,
            source: req.body.source,
            content: req.body.content,
            term: req.body.term,
            short_path: req.body.short_path,
            destination_url: req.body.destination_url,
        })
        const link = req.scope.resolve(ContainerRegistrationKeys.LINK)
        
        await link.create({
            [GUEST_MODULE]: {
                utm_source_id: createdUtm.id,
            },
            [Modules.PROMOTION]: {
                campaign_id: req.body.campaign_id,
            },
        })

        if (!req.body.promotion) {
            return res.json({
                message: "Campaign created successfully",
            })
        }

        await link.create({
            [GUEST_MODULE]: {
                utm_source_id: createdUtm.id,
            },
            [Modules.PROMOTION]: {
                promotion_id: req.body.promotion,
            },
        })

        return res.json({
            message: "Campaign created successfully",
        })
    } catch(e) {
        console.log("ERROR", e)
        res.status(500).send()
    }
}
