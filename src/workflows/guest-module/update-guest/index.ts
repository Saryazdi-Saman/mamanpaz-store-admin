import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Guest } from "src/modules/guest/models/guest"
import { InferTypeOf } from "@medusajs/framework/types"
import getGuestStep from "../get-guest/steps/get-guest-step"
import updateGuestStep from "./steps/update-guest-step"
import { OnboardingStage } from "src/modules/guest/types"
import createOnboardingStageHistoryStep from "../create-guest/steps/create-onboarding-stage-history-step"

type UpdateGuestWorkflowInput = {
    token: string
    next_stage: OnboardingStage
    updates: Partial<InferTypeOf<typeof Guest>>
}

const updateGuestWorkflow = createWorkflow(
    "update-guest",
    (input: UpdateGuestWorkflowInput) => {
        const guest = getGuestStep({
            token: input.token,
        })

        const stage_history = createOnboardingStageHistoryStep({
            guest_id: guest.id,
            stage: input.next_stage,
        })

        const updatedGuest = updateGuestStep({
            guest: guest,
            updates: input.updates,
            next_stage: input.next_stage,
        })
        return new WorkflowResponse(updatedGuest)
    }
)

export default updateGuestWorkflow
