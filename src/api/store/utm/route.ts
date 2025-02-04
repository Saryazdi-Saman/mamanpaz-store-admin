import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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
    // res.json({
    //     success: true,
    // })
}
