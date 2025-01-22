import { InferTypeOf } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "src/modules/guest"
import { Guest } from "src/modules/guest/models/guest"
import GuestModuleService from "src/modules/guest/service"

type updateStepInput = {
    guest: InferTypeOf<typeof Guest>
    updates: Partial<InferTypeOf<typeof Guest>>
}

const updateGuestStep = createStep(
    "update-guest-step",
    async (input: updateStepInput, { container }) => {
        const guestModuleService: GuestModuleService = container.resolve(
            GUEST_MODULE
        )

        const allowedUpdates = ["daily_meals", "weekly_meals", "delivery", "email", "email_verified", "password", "name", "last_name", "address", "city"]

        const updates = {
            ...Object.fromEntries(
                Object.entries(input.updates)
                    .filter(([key]) => allowedUpdates.includes(key))
            ),
            id: input.guest.id,
        }
        const guest = await guestModuleService.updateGuests(updates)
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
