import { InferTypeOf } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "src/modules/guest"
import { Guest } from "src/modules/guest/models/guest"
import GuestModuleService from "src/modules/guest/service"

type updateStepInput = {
    guest: InferTypeOf<typeof Guest>
}

const updateGuestExpirationDateStep = createStep(
    "update-guest-step",
    async (input: updateStepInput, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )
        const expiresInOneWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const guest = await guestModuleService.updateGuests({
            id: input.guest.id,
            expires_at: expiresInOneWeek,
        })

        return new StepResponse(guest[0], input.guest)
    },

    async (guest: InferTypeOf<typeof Guest>, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        await guestModuleService.updateGuests(guest)
    }
)

export default updateGuestExpirationDateStep