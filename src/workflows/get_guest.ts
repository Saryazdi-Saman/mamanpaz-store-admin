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
}

export const updateGuestStep = createStep(
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

type GetGuestWorkflowInput = {
    token: string
  }
  
  export const getGuestWorkflow = createWorkflow(
    "get-guest",
    (input: GetGuestWorkflowInput) => {
      const guest = getGuestStep(input)
      updateGuestStep({guest})
      return new WorkflowResponse(guest)
    }
  )