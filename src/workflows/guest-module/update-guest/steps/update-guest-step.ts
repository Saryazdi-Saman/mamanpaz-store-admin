import { InferTypeOf } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "src/modules/guest"
import { Guest } from "src/modules/guest/models/guest"
import GuestModuleService from "src/modules/guest/service"
import { OnboardingStage } from "src/modules/guest/types"

type updateStepInput = {
    guest: InferTypeOf<typeof Guest>
    updates: Partial<InferTypeOf<typeof Guest>>
    next_stage: OnboardingStage
}

const updateGuestStep = createStep(
    "update-guest-step",
    async (input: updateStepInput, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        const guest = await guestModuleService.updateGuests({
            id: input.guest.id,
            current_stage: input.next_stage,
            ...input.updates,
        })
        const prevState = input.guest

        return new StepResponse(guest, prevState)
    },

    async (guest: InferTypeOf<typeof Guest>, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        await guestModuleService.updateGuests(guest)
    }
)

export default updateGuestStep
