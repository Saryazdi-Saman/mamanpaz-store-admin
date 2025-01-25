import createPriceTierStep, { CreatePriceTierInput } from "./steps/create-price-tier"
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createPlanCategoryStep from "./steps/create-plan-category"
import { createProductsWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules, ProductStatus } from "@medusajs/framework/utils"
import { SUBSCRIPTION_PLAN_MODULE } from "src/modules/subscription-plan"
import getPlanProductCategoryStep from "./steps/get-plan-product-category"

type CreateSubscriptionPlanPackageWorkflowInput = {
    name: string,
    price_tiers: Omit<CreatePriceTierInput, "category">[],
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
                const newTierData = {
                    ...priceTier,
                    category: data.plan_category.id,
                }
                return newTierData
            })
        )

        const { price_tiers: priceTiers } = createPriceTierStep(
            createPriceTierInput
        )

        const variant_options = transform(
            { price_tiers },
            (data) => data.price_tiers.map((priceTier) => priceTier.name)
        )

        const productVariants = transform(
            { price_tiers },
            (data) => data.price_tiers.map((priceTier) => {
                return {
                    title: priceTier.name,
                    sku: priceTier.name,
                    options: {
                        Plans: priceTier.name,
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

        const product = createProductsWorkflow.runAsStep({
            input: {
                products: [
                    {
                        title: name,
                        category_ids: [product_category.id],
                        status: ProductStatus.PUBLISHED,
                        options: [
                            {
                                title: "Plans",
                                values: variant_options,
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
                    [SUBSCRIPTION_PLAN_MODULE]: {
                        price_tier_id: priceTier.id,
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
                [SUBSCRIPTION_PLAN_MODULE]: {
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
            price_tiers: priceTiers,
            product_id: product[0].id,
        })
    },
)

export default createPriceTiersWorkflow