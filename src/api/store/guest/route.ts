import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import { InferTypeOf } from "@medusajs/framework/types"
import { Guest } from "src/modules/guest/models/guest"
import createGuestWorkflow from "src/workflows/guest-module/create-guest"
import { getGuestWorkflow } from "src/workflows/guest-module/get-guest"
import updateGuestWorkflow from "src/workflows/guest-module/update-guest"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const session: string | undefined = req.cookies.guest_session
    if (!session) {
        const { result } = await createGuestWorkflow(req.scope)
            .run()

        res.json({ guest: result })
    } else {
        const { result } = await getGuestWorkflow(req.scope)
            .run({
                input: {
                    token: session
                }
            })
        res.json({ guest: result })
    }
}

type PUTRequest = {
    updates: Partial<InferTypeOf<typeof Guest>>
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
                }
            })
        res.json({ guest: result })
    }
}
