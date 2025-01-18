import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "../modules/guest"
import GuestModuleService from "../modules/guest/service"
import { Guest } from "src/modules/guest/models/guest"
import { InferTypeOf } from "@medusajs/framework/types"

export type getGuestStepInput = {
    token: string
}

export const getGuestStep = createStep(
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

export type updateStepInput = {
    guest: InferTypeOf<typeof Guest>
    updates: Partial<InferTypeOf<typeof Guest>>
}

export const updateGuestStep = createStep(
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

type UpdateGuestWorkflowInput = {
    token: string
    updates: Partial<InferTypeOf<typeof Guest>>
}

export const updateGuestWorkflow = createWorkflow(
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
