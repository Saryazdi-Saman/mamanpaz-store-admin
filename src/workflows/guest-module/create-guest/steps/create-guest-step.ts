import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "src/modules/guest"
import GuestModuleService from "src/modules/guest/service"

const createGuestStep = createStep(
    "create-guest-step",
    async ({ }, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        const guest = await guestModuleService.createNewGuest()

        return new StepResponse(guest, guest.id)
    },

    async (id: string, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        await guestModuleService.deleteGuests(id)
    }
)

export default createGuestStep