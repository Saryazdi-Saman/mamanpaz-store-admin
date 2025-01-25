import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

const getPlanProductCategoryStep = createStep(
    "get-plan-product-category-step",
    async ({ }, { container }) => {
        const productService = container.resolve(Modules.PRODUCT)

        const productCategory = await productService.listProductCategories({
            name: "Plans",
        })

        if (!productCategory.length) {
            const newCategory = await productService.createProductCategories({
                name: "Plans",
                is_active: true,
            })

            return new StepResponse({
                product_category: newCategory,
            })
        }
        return new StepResponse({
            product_category: productCategory[0],
        })

    }
)

export default getPlanProductCategoryStep