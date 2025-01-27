import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import createGuestStep from "./steps/create-guest-step"
import { createCartWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { GUEST_MODULE } from "src/modules/guest"
import { Modules } from "@medusajs/framework/utils"
import createOnboardingStageHistoryStep from "./steps/create-onboarding-stage-history-step"

const createGuestWorkflow = createWorkflow(
    "create-guest",
    () => {
        const guest = createGuestStep()

        const stage_history = createOnboardingStageHistoryStep({
            guest_id: guest.id,
        })
        // const { meal_plan_variant_id, delivery_plan_variant_id } = getInitialGuestCartItemsStep()

        const cart = createCartWorkflow.runAsStep({
            input: {
                items: [
                    // {
                    //     variant_id: meal_plan_variant_id,
                    //     quantity: 1,
                    // },
                    // {
                    //     variant_id: delivery_plan_variant_id,
                    //     quantity: 1,
                    // },
                ],
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
