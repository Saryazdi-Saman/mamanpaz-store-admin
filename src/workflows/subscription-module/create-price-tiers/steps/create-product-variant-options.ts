import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

type CreateProductVariantOptionsInput = {
    name: string,
    meals_per_week: number,
    meals_per_day: number,
    price_per_meal: number,
    delivery_schedule_id: string,
    delivery_schedule_title: string,
}

const createProductVariantOptions = createStep(
    "create-product-variant-options",
    async (data: CreateProductVariantOptionsInput[], { container }) => {

        const options = {
            meals: [...new Set(data.map(item => item.name))],
            delivery: [...new Set(data.map(item => item.delivery_schedule_title))]
        }

        return new StepResponse({options})
    }
)

export default createProductVariantOptions