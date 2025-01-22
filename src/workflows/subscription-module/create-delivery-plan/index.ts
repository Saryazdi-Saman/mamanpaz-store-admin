import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createDeliveryPlanStep from "./steps/create-delivery-plan"
import getProductCategoryStep from "../../shared/get-product-category"
import createDeliveryProductStep from "./steps/create-delivery-product"
import { createProductVariantsWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { SUBSCRIPTION_PLAN_MODULE } from "src/modules/subscription-plan"
import { Modules } from "@medusajs/framework/utils"

export type CreateDeliveryPlanInput = {
    name: string,
    price: number,
    monday?: number,
    tuesday?: number,
    wednesday?: number,
    thursday?: number,
    friday?: number,
    saturday?: number,
    sunday?: number,
}

const createDeliveryPlanWorkflow = createWorkflow(
    "create-delivery-plan-workflow",
    (input: CreateDeliveryPlanInput) => {
        const { delivery_plan } = createDeliveryPlanStep(input)

        const { product_category } = getProductCategoryStep()

        const { product } = createDeliveryProductStep({
            category_id: product_category.id,
        })

        const variant = createProductVariantsWorkflow.runAsStep({
            input: {
                product_variants: [{
                    product_id: product.id,
                    title: delivery_plan.name,
                    prices: [{
                        amount: delivery_plan.price,
                        currency_code: "cad",
                    }],
                    // options: {
                    //     Frequency: delivery_plan.name,
                    // },
                    manage_inventory: false,
                    metadata: {
                        Monday: delivery_plan.monday,
                        Tuesday: delivery_plan.tuesday,
                        Wednesday: delivery_plan.wednesday,
                        Thursday: delivery_plan.thursday,
                        Friday: delivery_plan.friday,
                        Saturday: delivery_plan.saturday,
                        Sunday: delivery_plan.sunday,
                    }
                }]
            },
        })
        
        createRemoteLinkStep([{
            [ SUBSCRIPTION_PLAN_MODULE ]: {
                delivery_plan_id: delivery_plan.id,
            },
            [ Modules.PRODUCT ]: {
                product_variant_id: variant[0].id,
            },
        }])

        return new WorkflowResponse({
            delivery_plan,
            product_id: product.id,
            variant_id: variant[0].id,
        })
    }
)

export default createDeliveryPlanWorkflow