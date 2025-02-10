import { Modules, PriceListStatus } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { CreatePriceListWorkflowInputDTO } from "@medusajs/types";

type CreatePriceListInputData = {
    category_name: string,
    extra_meal_variant_id: string,
    priceTiersInputData: {
        category: string;
        customer_group_name: string;
        name: string;
        slug: string;
        meals_per_week: number;
        meals_per_day: number;
        price_per_meal: number;
        delivery_schedule_id: string;
    }[]
}

const createPriceListInput = createStep(
    "create-price-list-input",
    async ({
        priceTiersInputData,
        category_name,
        extra_meal_variant_id
    }: CreatePriceListInputData, { container }) => {
        const customerService = container.resolve(Modules.CUSTOMER)
        /// filter for groups created now
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const customer_groups = await customerService.listCustomerGroups({
            created_at: {
                $gt: tenMinutesAgo.toISOString(),
            },
        })

        const priceListsInputData = priceTiersInputData.map((priceTier) => {
            return {
                title: `${category_name} - ${priceTier.slug}`,
                description: `Extra meal pricing for ${priceTier.customer_group_name}`,
                status: PriceListStatus.ACTIVE,
                type: "override",
                rules: {
                    ["customer.groups.id"]: [customer_groups.find(group => group.name === priceTier.customer_group_name)?.id],
                },
                prices: [
                    {
                        amount: priceTier.price_per_meal,
                        currency_code: "cad",
                        variant_id: extra_meal_variant_id,
                    },
                ]
            }
        }) as CreatePriceListWorkflowInputDTO[]

        return new StepResponse({
            price_lists_input_data: priceListsInputData
        })
    },
)

export default createPriceListInput