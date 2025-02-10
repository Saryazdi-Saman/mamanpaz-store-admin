import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

const getExtraMealProductVariant = createStep(
    "get-extra-meal-product-variant",
    async ({ }, { container }) => {
        const productService = container.resolve(Modules.PRODUCT)

        const extraMealProduct = await productService.listProducts({
            title: "Extra Meal",
        },{
          relations: ["variants"],
          take: 1
        })
        if (extraMealProduct.length === 0) {
            const newProduct = await productService.createProducts({
                title: "Extra Meal",
                status: "published",
                options: [{
                    title: "Default",
                    values: ["Default"]
                  }],
                  variants: [
                    {
                      title: "Extra Meal",
                      options: {
                        Default: "Default"
                      },
                    }
                  ]
            })
            return new StepResponse({
                extra_meal_variant_id: newProduct.variants[0].id,
            })

        }
        return new StepResponse({
            extra_meal_variant_id: extraMealProduct[0].variants[0].id,
        })

    }
)

export default getExtraMealProductVariant