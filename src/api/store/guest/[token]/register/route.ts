import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { validateAndDecodeJWT } from "src/api/lib/jwt-validation";
import { GUEST_MODULE } from "src/modules/guest";
import subscribeGuestWorkflow from "src/workflows/subscription-module/subscribe-guest";

type PostRequest = {
    cart_id: string
    payment_intent_id: string
}

export const POST = async (
    req: MedusaRequest<PostRequest>,
    res: MedusaResponse
) => {
    const authHeader = req.headers.authorization
    const jwt = authHeader?.split(' ')[1]
    if (!jwt) {
        return res.status(401).send()
    }
    const jwtPayload = validateAndDecodeJWT(jwt)
    if (!jwtPayload || !jwtPayload.auth_identity_id) {
        return res.status(401).send()
    }

    const { token } = req.params;
    const query = req.scope.resolve("query");

    const {
        data
    } = await query.graph({
        entity: "guest",
        fields: [
            "id",
            "cart.id"
        ],
        filters: {
            token
        }
    })

    if (data.length === 0) {
        return res.status(400).json({
            success: false,
            error: "GUEST_NOT_FOUND",
        })
    }

    if (!data[0].cart || data[0].cart.id !== req.body.cart_id) {
        return res.status(400).json({
            success: false,
            error: "CART_NOT_FOUND",
        })
    }

    const guestModule = req.scope.resolve(GUEST_MODULE)
    const guest = await guestModule.retrieveGuest(data[0].id)

    subscribeGuestWorkflow().run({
        input: {
            cart_id: data[0].cart.id,
            guest: guest,
            auth_identity_id: jwtPayload.auth_identity_id
        }
    })

    return res.status(200).send()
}