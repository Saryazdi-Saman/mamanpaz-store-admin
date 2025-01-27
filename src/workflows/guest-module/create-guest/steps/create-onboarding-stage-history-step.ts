import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { GUEST_MODULE } from "src/modules/guest";
import { OnboardingStage } from "src/modules/guest/types";

type CreateStageHistoriesInput = {
    guest_id: string
    stage?: OnboardingStage
}
const createOnboardingStageHistoryStep = createStep(
    "create-onboarding-stage-history-step",
    async (input: CreateStageHistoriesInput, { container }) => {
        const guestModuleService = container.resolve(GUEST_MODULE)
        const stage_history = await guestModuleService.createStageHistories({
            guest: input.guest_id,
            stage: input.stage || OnboardingStage.INITIAL,
        })
        return new StepResponse(stage_history, stage_history.id)
    },

    async (id: string, { container }) => {
        const guestModuleService = container.resolve(GUEST_MODULE)
        await guestModuleService.deleteStageHistories(id)
    }
)

export default createOnboardingStageHistoryStep