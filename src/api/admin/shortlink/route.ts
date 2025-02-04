import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CreateCampaignSchema } from "src/admin/validation-schemas"
import { MARKETING_MODULE } from "src/modules/marketing"
import z from "zod"

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: qr_link,
    } = await query.graph({
        entity: "qr_link",
        fields: [
            "*",
        ],
    })
    res.json({
        data: qr_link,
    })
}

type CreateCampaignInput = z.infer<typeof CreateCampaignSchema>
export const POST = async (
    req: AuthenticatedMedusaRequest<CreateCampaignInput>,
    res: MedusaResponse
) => {
    const marketingModule = req.scope.resolve(MARKETING_MODULE)
    const destination_url = req.body.destination_url.length === 0
        || req.body.destination_url[0] === "/" ? req.body.destination_url : '/' + req.body.destination_url

    try {
        const shortlink = await marketingModule.createQrLinks({
            name: req.body.name,
            campaign_name: req.body.campaign,
            medium: req.body.medium,
            source: req.body.source,
            content: req.body.content,
            term: req.body.term,
            link: req.body.code,
            destination_url: destination_url,
        })
        const link = req.scope.resolve(ContainerRegistrationKeys.LINK)

        await link.create({
            [MARKETING_MODULE]: {
                qr_link_id: shortlink.id,
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
            [MARKETING_MODULE]: {
                qr_link_id: shortlink.id,
            },
            [Modules.PROMOTION]: {
                promotion_id: req.body.promotion,
            },
        })

        return res.json({
            message: "Campaign created successfully",
        })
    } catch (e) {
        console.log("ERROR", e)
        res.status(500).send()
    }
}
