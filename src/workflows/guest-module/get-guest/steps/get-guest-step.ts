import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "src/modules/guest"
import GuestModuleService from "src/modules/guest/service"

type getGuestStepInput = {
    token: string
}

const getGuestStep = createStep(
    "get-guest-step",
    async (input: getGuestStepInput, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        const guest = await guestModuleService.listGuests({
            token: input.token,
        })

        return new StepResponse(guest[0], guest[0].id)
    },
)

export default getGuestStep
