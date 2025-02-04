import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { GUEST_MODULE } from "src/modules/guest";

type GetResponse = {
    url: string,
}
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse<GetResponse>
) => {
    const shortlink = req.params.shortlink
    console.log("shortlink", shortlink)
    const guestModule = req.scope.resolve(GUEST_MODULE)

    const utmSource = await guestModule.listUtmSources({
        short_path: shortlink,
    })
    console.log("utmSource", utmSource)
    if (!utmSource || utmSource.length === 0) {
        console.log("utmSource not found")
        return res.json({
            url: "",
        })
    }
    const utm = utmSource[0]
    
    const params = new URLSearchParams();

    if (utm.source) params.append("utm_source", utm.source);
    if (utm.medium) params.append("utm_medium", utm.medium);
    if (utm.campaign_name) params.append("utm_campaign", utm.campaign_name);
    if (utm.content) params.append("utm_content", utm.content);
    if (utm.term) params.append("utm_term", utm.term);

    const url = `${utm.destination_url}${params.toString() ? "?" + params.toString() : ""}`;
    return res.json({
        url
    })
}