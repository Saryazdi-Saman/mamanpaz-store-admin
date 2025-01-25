import type {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const {
        data: guest,
    } = await query.graph({
        entity: "guest",
        fields: [
            "*",
            "cart.id",
        ],
        filters: {
            token: req.params.token
        }
    })
    if (!guest || guest.length === 0 || guest[0].cart === null) {
        res.status(404).json({ message: "Guest not found" })
    } else {
        res.json({ cart_id: guest[0].cart.id, token: guest[0].token })
    }
}