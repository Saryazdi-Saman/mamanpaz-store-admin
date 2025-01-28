import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { InferTypeOf } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { GUEST_MODULE } from "src/modules/guest"
import { Guest } from "src/modules/guest/models/guest"
import { OnboardingStage } from "src/modules/guest/types"
import createGuestWorkflow from "src/workflows/guest-module/create-guest"
import updateGuestWorkflow from "src/workflows/guest-module/update-guest"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { result } = await createGuestWorkflow(req.scope)
        .run()
    res.json({ cart_id: result.cart.id, token: result.guest.token })
}

type PostRequestBody = {
    token: string | null | undefined
    cart_id: string | null | undefined
}

export const POST = async (
    req: MedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const guestModule = req.scope.resolve(GUEST_MODULE)
    const {
        data: guest,
    } = await query.graph({
        entity: "guest",
        fields: [
            "cart.id",
        ],
        filters: {
            token: req.body.token as string
        }
    })
    if (!guest 
        || guest.length === 0 
        || guest[0].cart === null 
        || guest[0].cart.id !== req.body.cart_id
    ) {
        const { result } = await createGuestWorkflow(req.scope)
            .run()
        res.json({ cart_id: result.cart.id, token: result.guest.token })
    } else {
        await guestModule.updateGuests({
            id: guest[0].id,
            last_active_at: new Date(Date.now())
        })
        res.json({ cart_id: req.body.cart_id, token: req.body.token })
    }
}


type PUTRequest = {
    updates: Partial<InferTypeOf<typeof Guest>>
    next_step: OnboardingStage
}

export const PUT = async (
    req: MedusaRequest<PUTRequest>,
    res: MedusaResponse
) => {
    console.log("PUT Request received")
    console.log("Request body:", req.body)
    // console.log("Cookies:", req.cookies)
    // res.json({ message: "PUT request received" })
    const cookieSession: string | undefined = req.cookies.guest_session
    if (!cookieSession) {
        res.status(401).json({ message: "Unauthorized" })
        return
    } else {
        const { result } = await updateGuestWorkflow(req.scope)
            .run({
                input: {
                    token: cookieSession,
                    updates: req.body.updates,
                    next_stage: req.body.next_step,
                }
            })
        res.json({ guest: result })
    }
}
