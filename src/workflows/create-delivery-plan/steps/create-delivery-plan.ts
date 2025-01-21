import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateDeliveryPlanInput } from ".."
import SubscriptionPlanModuleService from "src/modules/subscription-plan/service"
import { SUBSCRIPTION_PLAN_MODULE } from "src/modules/subscription-plan"

const createDeliveryPlanStep = createStep(
    "create-delivery-plan-step",
    async (input: CreateDeliveryPlanInput, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)
        
        const deliveryPlan = await subscriptionPlanModuleService
            .createDeliveryPlans({
                name: input.name,
                price: input.price,
                monday: input.monday,
                tuesday: input.tuesday,
                wednesday: input.wednesday,
                thursday: input.thursday,
                friday: input.friday,
                saturday: input.saturday,
                sunday: input.sunday,
            })
        
        return new StepResponse({
            delivery_plan: deliveryPlan,
        }, {
            delivery_plan: deliveryPlan
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

        await subscriptionPlanModuleService.deleteDeliveryPlans(data?.delivery_plan.id)
    }
)

export default createDeliveryPlanStep