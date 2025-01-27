import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"

type CreateGuestCartInput = {
    token: string
    meal_plan_variant: string
    delivery_plan_variant: string
}

export const createGuestCartWorkflow = createWorkflow(
    "create-guest-cart-workflow",
    (input: CreateGuestCartInput) => {
        return new WorkflowResponse({
            cart_id: "cart-id",
            token: input.token,
        })
    }
)