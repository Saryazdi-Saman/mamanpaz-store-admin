import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ProductType } from "src/modules/subscription-plan/types"

const getPlanProductTypeStep = createStep(
    "get-plan-product-type-step",
    async ({ }, { container }) => {
        const productService = container.resolve(Modules.PRODUCT)

        const productType = await productService.listProductTypes({
            value: ProductType.MEAL_PLAN,
        })

        if (!productType.length) {
            const newType = await productService.createProductTypes({
                value: ProductType.MEAL_PLAN,
            })
            return new StepResponse({
                product_type_id: newType.id,
            })
        } 
        return new StepResponse({
            product_type_id: productType[0].id,
        })
    }
)

export default getPlanProductTypeStep