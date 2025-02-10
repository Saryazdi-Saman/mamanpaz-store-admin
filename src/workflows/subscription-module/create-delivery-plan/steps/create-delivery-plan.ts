import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateDeliveryPlanInput } from ".."
import SubscriptionPlanModuleService from "src/modules/subscription/service"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import { title } from "process"

const createDeliveryPlanStep = createStep(
    "create-delivery-plan-step",
    async (input: CreateDeliveryPlanInput, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)
        
        const deliveryPlan = await subscriptionPlanModuleService.createDeliveryPlans({
            title: input.name,
            day1: input.day_one,
            day2: input.day_two,
            day3: input.day_three,
            day4: input.day_four,
            day5: input.day_five,
            day6: input.day_six,
            day7: input.day_seven,
        })
        
        return new StepResponse({
            delivery_plan: deliveryPlan,
        }, {
            delivery_plan: deliveryPlan
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)

        await subscriptionPlanModuleService.deleteDeliveryPlans(data?.delivery_plan.id)
    }
)

export default createDeliveryPlanStep