import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateDeliveryPlanInput } from ".."
import SubscriptionPlanModuleService from "src/modules/subscription/service"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import { title } from "process"
import { InferTypeOf } from "@medusajs/types"
import DeliveryPlan from "src/modules/subscription/models/delivery-plan"

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
        }) as Omit<InferTypeOf<typeof DeliveryPlan>, "plans">
        
        return new StepResponse({
            delivery_plan: deliveryPlan,
        }, {
            plan_id: deliveryPlan.id
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)
        if (data?.plan_id){
            await subscriptionPlanModuleService.deleteDeliveryPlans(data.plan_id)
        }
    }
)

export default createDeliveryPlanStep