import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { InferTypeOf } from "@medusajs/types"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import Plan from "src/modules/subscription/models/plan"
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
            .createPlans(data) as Omit<InferTypeOf<typeof Plan>, "delivery_schedule">[]
        
        const ids = priceTiers.map((tier)=> tier.id)

        const plans = await subscriptionPlanModuleService.listPlans({
            id: ids
        }, {
            relations: ['delivery_schedule']
        })

        // const plans = priceTiers.map((priceTier) => {
        //     const selected = data.find((input) => input.delivery_schedule_id === priceTier.delivery_schedule_id)
        //     return {
        //         plan: priceTier,
        //         delivery_schedule_title: selected.
        //     }
        // })

        return new StepResponse({
            price_tiers: plans,
        }, {
            price_tiers: priceTiers
        })
    },
    async (data, { container }) => {
        const subscriptionPlanModuleService: SubscriptionPlanModuleService =
            container.resolve(SUBSCRIPTION_MODULE)
        if(data?.price_tiers) await subscriptionPlanModuleService.deletePlans(data?.price_tiers)
    }
)

export default createPriceTierStep