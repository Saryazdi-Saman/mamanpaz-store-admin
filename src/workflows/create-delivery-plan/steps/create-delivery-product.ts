import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type CreateDeliveryProductInput = {
    category_id: string,
}
const createDeliveryProductStep = createStep(
    "create-delivery-product-step",
    async (input: CreateDeliveryProductInput, { container }) => {
        const productService = container.resolve(Modules.PRODUCT)

        const product = await productService.listProducts({
            title: "Delivery Plan",
        })

        if (product.length === 0) {
            const newProduct = await productService.createProducts({
                title: "Delivery Plan",
                category_ids: [input.category_id],
                status: "published",
            })
            return new StepResponse({
                product: newProduct,
            })
        }
        return new StepResponse({
            product: product[0],
        })

    },
)

export default createDeliveryProductStep