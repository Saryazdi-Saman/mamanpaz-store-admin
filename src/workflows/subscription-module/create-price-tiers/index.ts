import createPriceTierStep, { CreatePriceTierInput } from "./steps/create-price-tier"
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createPlanCategoryStep from "./steps/create-plan-category"
import { createProductsWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules, ProductStatus } from "@medusajs/framework/utils"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import getPlanProductCategoryStep from "./steps/get-plan-product-category"
import getPlanProductTypeStep from "./steps/get-plan-product-type"
import createProductVariantOptions from "./steps/create-product-variant-options"

type CreateSubscriptionPlanPackageWorkflowInput = {
    name: string,
    price_tiers: {
        name: string,
        meals_per_week: number,
        meals_per_day: number,
        price_per_meal: number,
        delivery_schedule_id: string,
        delivery_schedule_title: string,
    }[],
}

const createPriceTiersWorkflow = createWorkflow(
    "create-subscription-plan-package-workflow",
    (input: CreateSubscriptionPlanPackageWorkflowInput) => {
        const { name, price_tiers } = input

        const { plan_category } = createPlanCategoryStep({
            name
        })

        const createPriceTierInput = transform(
            {
                price_tiers,
                plan_category,
            },
            (data) => data.price_tiers.map((priceTier) => {
                const { delivery_schedule_title, ...createPlanInput } = priceTier;
                const newTierData = {
                    ...createPlanInput,
                    category: data.plan_category.id,
                }
                return newTierData
            })
        )

        const { price_tiers: priceTiers } = createPriceTierStep(
            createPriceTierInput
        )

        // const variants_meal_options = transform(
        //     { price_tiers },
        //     (data) => data.price_tiers.map((priceTier) => priceTier.name)
        // )

        // const variants_delivery_options = transform(
        //     { price_tiers },
        //     (data) => data.price_tiers.map((priceTier) => priceTier.delivery_schedule_title)
        // )

        const productVariants = transform(
            { price_tiers },
            (data) => data.price_tiers.map((priceTier) => {
                return {
                    title: priceTier.name,
                    options: {
                        Meals: priceTier.name,
                        Delivery: priceTier.delivery_schedule_title,
                    },
                    prices: [
                        {
                            amount: priceTier.price_per_meal * priceTier.meals_per_week,
                            currency_code: "cad",
                        },
                    ],
                    manage_inventory: false,
                }
            })
        )

        const { product_category } = getPlanProductCategoryStep()

        const { product_type_id } = getPlanProductTypeStep()

        const { options } = createProductVariantOptions(price_tiers)

        const product = createProductsWorkflow.runAsStep({
            input: {
                products: [
                    {
                        title: name,
                        type_id: product_type_id,
                        category_ids: [product_category.id],
                        status: ProductStatus.PUBLISHED,
                        options: [
                            {
                                title: "Meals",
                                values: options.meals,
                            },
                            {
                                title: "Delivery",
                                values: options.delivery,
                            },
                        ],
                        variants: productVariants,
                    }
                ],
            }
        })

        const linkedPlansAndVariants = transform(
            { priceTiers, product },
            (data) => data.priceTiers.map((priceTier) => {
                return {
                    [SUBSCRIPTION_MODULE]: {
                        plan_id: priceTier.id,
                    },
                    [Modules.PRODUCT]: {
                        product_variant_id: data.product[0].variants.find((variant) => variant.title === priceTier.name)?.id,
                    },
                }
            })
        )

        const createLinkInput = transform(
            { linkedPlansAndVariants, product, plan_category },
            (data) => [...data.linkedPlansAndVariants, {
                [SUBSCRIPTION_MODULE]: {
                    plan_category_id: data.plan_category.id,
                },
                [Modules.PRODUCT]: {
                    product_id: data.product[0].id,
                },
            }]
        )

        createRemoteLinkStep(createLinkInput)

        return new WorkflowResponse({
            category: plan_category,
            plans: priceTiers,
            product_id: product[0].id,
        })
    },
)

export default createPriceTiersWorkflow