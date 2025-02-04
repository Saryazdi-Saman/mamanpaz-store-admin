import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MARKETING_MODULE } from "src/modules/marketing";

type GetResponse = {
    url: string,
}
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse<GetResponse>
) => {
    const link = req.params.code
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
        data,
    } = await query.graph({
        entity: "qr_link",
        fields: [
            "*",
            "promotion.code",
        ],
        filters: {
            link: link
        }
    })
    
    if (data.length === 0) {
        console.log("QR link not found")
        return res.json({
            url: "/",
        })
    }
    const utm = data[0]
    
    const params = new URLSearchParams();

    if (utm.promotion && utm.promotion.code) params.append("promo", utm.promotion.code);
    if (utm.source) params.append("utm_source", utm.source);
    if (utm.medium) params.append("utm_medium", utm.medium);
    if (utm.campaign_name) params.append("utm_campaign", utm.campaign_name);
    if (utm.content) params.append("utm_content", utm.content);
    if (utm.term) params.append("utm_term", utm.term);

    const url = `${utm.destination_url}${params.toString() ? "?" + params.toString() : ""}`;
    res.json({
        url
    })
    const marketingModule = req.scope.resolve(MARKETING_MODULE)
    await marketingModule.updateQrLinks({
        id: data[0].id,
        visits: data[0].visits + 1
    })
    return
}