import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { InferTypeOf } from "@medusajs/types";
import { GUEST_MODULE } from "src/modules/guest";
import { Visit } from "src/modules/guest/models/visit";

export const POST = async (
    req: MedusaRequest<InferTypeOf<typeof Visit>>,
    res: MedusaResponse
) => {
    const guestModule = req.scope.resolve(GUEST_MODULE)
    const guest = await guestModule.listGuests({
        token: req.params.token,
    })
    if (!guest.length) {
        return res.status(404).send()
    }
    
    await guestModule.createVisits({
        guest_id: guest[0].id,
        ip_address: req.body.ip_address,
        user_agent: req.body.user_agent,
        referer: req.body.referer,
        origin: req.body.origin,
        utm_source: req.body.utm_source,
        utm_medium: req.body.utm_medium,
        utm_campaign: req.body.utm_campaign,
        utm_content: req.body.utm_content,
        utm_term: req.body.utm_term,
    })
    return res.send()
}