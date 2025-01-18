import {
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/framework/http"
import {
    createGuestWorkflow,
} from "../../../workflows/create_guest"
import { getGuestWorkflow } from "src/workflows/get_guest"
import { InferTypeOf } from "@medusajs/framework/types"
import { Guest } from "src/modules/guest/models/guest"
import { updateGuestWorkflow } from "src/workflows/update_guest"

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    // console.log(req.cookies.guest_session)
    const session: string | undefined = req.cookies.guest_session
    // console.log(session)
    // console.log(req.cookies)
    if (!session) {
        const { result } = await createGuestWorkflow(req.scope)
            .run()

        res.json({ guest: result })
        // console.log("no cookie detected")
        // console.log(session)
        // console.log("result")
        // console.log(result)
    } else {
        // console.log("cookie detected")
        // console.log(session)
        const { result } = await getGuestWorkflow(req.scope)
            .run({
                input: {
                    token: session
                }
            })
        // console.log("result")
        // console.log(result)
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
