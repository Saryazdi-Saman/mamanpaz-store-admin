import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_PLAN_MODULE } from "../../../modules/subscription-plan"
import SubscriptionPlanModuleService from "../../../modules/subscription-plan/service"

type DeleteSeliveryPlansStep = {
  ids: string[]
}

export const deleteDeliveryPlansStep = createStep(
    "delete-delivery-plans-step",
    async ({ ids }: DeleteSeliveryPlansStep, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

            await subscriptionPlanModuleService.softDeleteDeliveryPlans(ids)

            return new StepResponse({}, ids)
    },
    async (ids, { container }) => {
        if (!ids) {
            return
        }

        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

        await subscriptionPlanModuleService.restoreDeliveryPlans(ids)
    }
)