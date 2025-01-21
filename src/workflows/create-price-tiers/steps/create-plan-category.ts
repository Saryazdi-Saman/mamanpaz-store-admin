import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { SUBSCRIPTION_PLAN_MODULE } from "src/modules/subscription-plan";
import SubscriptionPlanModuleService from "src/modules/subscription-plan/service";

export type CreatePlanCategoryInput = {
    name: string,
}
const createPlanCategoryStep = createStep(
    "create-plan-category-step",
    async (data: CreatePlanCategoryInput, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)
            
        const planCategory = await subscriptionPlanModuleService
            .createPlanCategories({
                name: data.name,
            })
        
        return new StepResponse({
            plan_category: planCategory,
        }, {
            plan_category: planCategory
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

        await subscriptionPlanModuleService.deletePlanCategories(data?.plan_category.id)
    }
)

export default createPlanCategoryStep