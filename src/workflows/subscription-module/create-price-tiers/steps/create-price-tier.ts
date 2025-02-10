import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import SubscriptionPlanModuleService from "src/modules/subscription/service"

export type CreatePriceTierInput = {
    name: string,
    slug: string,
    meals_per_week: number,
    meals_per_day: number,
    category: string,
    price_per_meal: number,
    delivery_schedule_id: string,
    customer_group_name: string,
}

const createPriceTierStep = createStep(
    "create-price-tier-step",
    async (data: CreatePriceTierInput[], { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)

        const priceTiers = await subscriptionPlanModuleService
            .createPlans(data)

        return new StepResponse({
            price_tiers: priceTiers,
        }, {
            price_tiers: priceTiers
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)

        await subscriptionPlanModuleService.deletePlans(data?.price_tiers.id)
    }
)

export default createPriceTierStep