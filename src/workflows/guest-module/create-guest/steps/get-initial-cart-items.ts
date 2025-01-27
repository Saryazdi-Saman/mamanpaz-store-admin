import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

const getInitialGuestCartItemsStep = createStep(
    "get-initial-cart-items-step",
    async ({ }, { container }) => {
        const query = container.resolve(ContainerRegistrationKeys.QUERY)

        const {
            data: plans
        } = await query.graph({
            entity: "price_tiers",
            pagination:{
                skip: 0,
                order: {
                    meals_per_day: "ASC"
                }
            },
            fields: [
                "product_variant.id",
            ]
        })

        const {
            data: deliveryPlans
        } = await query.graph({
            entity: "delivery_plans",
            pagination:{
                skip: 0,
                order: {
                    price: "ASC"
                },
                take: 1
            },
            fields: [
                "product_variant.id",
            ]
        })
        
        const meal_plan_variant_id = plans[0].product_variant?.id 
        const delivery_plan_variant_id = deliveryPlans[0].product_variant?.id

        return new StepResponse({
            meal_plan_variant_id,
            delivery_plan_variant_id,
        })
    }
)

export default getInitialGuestCartItemsStep