import {
    createWorkflow,
    transform,
    when,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import getGuestStep from "./steps/get-guest-step"
import updateGuestExpirationDateStep from "./steps/update-expiration-date-step"
import createGuestWorkflow from "../create-guest"


type GetGuestWorkflowInput = {
    token: string
}

export const getGuestWorkflow = createWorkflow(
    "get-guest",
    (input: GetGuestWorkflowInput) => {
        const guest = getGuestStep(input)
        const guestExists = transform(
            { guest },
            (data) => data.guest.id !== undefined
        )
        const updatedGuest = updateGuestExpirationDateStep({ guest })
        return new WorkflowResponse(updatedGuest)
    }
)