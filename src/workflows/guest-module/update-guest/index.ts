import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Guest } from "src/modules/guest/models/guest"
import { InferTypeOf } from "@medusajs/framework/types"
import getGuestStep from "../get-guest/steps/get-guest-step"
import updateGuestStep from "./steps/update-guest-step"

type UpdateGuestWorkflowInput = {
    token: string
    updates: Partial<InferTypeOf<typeof Guest>>
}

const updateGuestWorkflow = createWorkflow(
    "update-guest",
    (input: UpdateGuestWorkflowInput) => {
        const guest = getGuestStep({
            token: input.token,
        })
        const updatedGuest = updateGuestStep({
            guest: guest,
            updates: input.updates,
        })
        return new WorkflowResponse(updatedGuest)
    }
)

export default updateGuestWorkflow
