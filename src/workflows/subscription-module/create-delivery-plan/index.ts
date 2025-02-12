import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createDeliveryPlanStep from "./steps/create-delivery-plan"
export type CreateDeliveryPlanInput = {
    name: string,
    day_one?: number,
    day_two?: number,
    day_three?: number,
    day_four?: number,
    day_five?: number,
    day_six?: number,
    day_seven?: number,
}

const createDeliveryPlanWorkflow = createWorkflow(
    "create-delivery-plan-workflow",
    (input: CreateDeliveryPlanInput) => {
        const { delivery_plan } = createDeliveryPlanStep(input)

        return new WorkflowResponse(
            delivery_plan,
        )
    }
)

export default createDeliveryPlanWorkflow