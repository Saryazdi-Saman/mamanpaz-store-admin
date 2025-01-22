import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import createGuestStep from "./steps/create-guest-step"
import { createCartWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { GUEST_MODULE } from "src/modules/guest"
import { Modules } from "@medusajs/framework/utils"

const createGuestWorkflow = createWorkflow(
    "create-guest",
    () => {
        const guest = createGuestStep()
        const cart = createCartWorkflow.runAsStep({
            input: {
            },
        })
        createRemoteLinkStep([{
            [GUEST_MODULE]: {
                guest_id: guest.id,
            },
            [Modules.CART]: {
                cart_id: cart.id,
            }
        }])
        return new WorkflowResponse({
            guest,
            cart,
        })
    }
)

export default createGuestWorkflow