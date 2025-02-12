import createPriceTierStep from "./steps/create-price-tier"
import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import createPlanCategoryStep from "./steps/create-plan-category"
import { createCustomerGroupsWorkflow, createPriceListsWorkflow, createProductsWorkflow, createRemoteLinkStep } from "@medusajs/medusa/core-flows"
import { Modules, ProductStatus } from "@medusajs/framework/utils"
import { SUBSCRIPTION_MODULE } from "src/modules/subscription"
import getPlanProductCategoryStep from "./steps/get-plan-product-category"
import getPlanProductTypeStep from "./steps/get-plan-product-type"
import createProductVariantOptions from "./steps/create-product-variant-options"
import createInputDataStep from "./steps/create-input-data"
import getExtraMealProductVariant from "./steps/get-extra-meal-product-variant"
import createPriceListInput from "./steps/create-price-list-input"
import getSalesChannelsStep from "./steps/get-sales-channels"

type CreateSubscriptionPlanPackageWorkflowInput = {
    name: string,
    price_tiers: {
        name: string,
        slug: string,
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

        const {
            price_tier_input_data: priceTiersInputData,
            customer_group_input_data: customerGroupNames,
        } = createInputDataStep({
            name,
            category_id: plan_category.id,
            price_tiers,
        })

        const { price_tiers: priceTiers } = createPriceTierStep(
            priceTiersInputData
        )

        const productVariants = transform(
            { priceTiers },
            (data) => data.priceTiers.map((plan) => {
                
                return {
                    title: `${plan.name} - Delivered ${plan.delivery_schedule.title}`,
                    options: {
                        Meals: plan.name,
                        Delivery: plan.delivery_schedule.title,
                    },
                    prices: [
                        {
                            amount: plan.price_per_meal * plan.meals_per_week,
                            currency_code: "cad",
                        },
                    ],
                    manage_inventory: false,
                    metadata: {
                        plan_id: plan.id,
                        meals_per_week: plan.price_per_meal,
                        meals_per_day: plan.meals_per_day,
                        price_per_meal: plan.price_per_meal,
                        delivery_schedule: plan.delivery_schedule
                    },
                }
            })
        )

        const { product_category } = getPlanProductCategoryStep()

        const { product_type_id } = getPlanProductTypeStep()

        const { sales_channels_ids } = getSalesChannelsStep()

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
                        sales_channels: sales_channels_ids,
                        variants: productVariants,
                    }
                ],
            }
        })

        createCustomerGroupsWorkflow.runAsStep({
            input: {
                customersData: customerGroupNames,
            }
        })


        const {extra_meal_variant_id} = getExtraMealProductVariant()

        const { price_lists_input_data: priceListInputData } = createPriceListInput({
            category_name: name,
            extra_meal_variant_id,
            priceTiersInputData,
        })

        createPriceListsWorkflow.runAsStep({
            input: {
                price_lists_data: priceListInputData,
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
                        product_variant_id: data.product[0].variants.find((variant) => variant.metadata?.plan_id === priceTier.id)?.id,
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