import {
    createStep,
    StepResponse,
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { GUEST_MODULE } from "../modules/guest"
import GuestModuleService from "../modules/guest/service"

// export type CreateGuestStepInput = {
//     token: string
// }

export const createGuestStep = createStep(
    "create-guest-step",
    async ({},{ container }) => {
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

// type CreateGuestWorkflowInput = {
//     name: string
//   }
  
  export const createGuestWorkflow = createWorkflow(
    "create-guest",
    () => {
      const guest = createGuestStep()
  
      return new WorkflowResponse(guest)
    }
  )