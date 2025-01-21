import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_PLAN_MODULE } from "src/modules/subscription-plan"
import SubscriptionPlanModuleService from "src/modules/subscription-plan/service"

export type CreatePriceTierInput = {
    name: string,
    meals_per_week: number,
    meals_per_day: number,
    category: string,
    price_per_meal: number,
}

const createPriceTierStep = createStep(
    "create-price-tier-step",
    async (data: CreatePriceTierInput[], { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

        const priceTiers = await subscriptionPlanModuleService
            .createPriceTiers(data)

        return new StepResponse({
            price_tiers: priceTiers,
        }, {
            price_tiers: priceTiers
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_PLAN_MODULE)

        await subscriptionPlanModuleService.deletePriceTiers(data?.price_tiers.id)
    }
)

export default createPriceTierStep