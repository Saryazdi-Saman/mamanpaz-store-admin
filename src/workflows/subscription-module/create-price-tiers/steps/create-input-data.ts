import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

type CreateInputDataStepInput = {
    name: string,
    category_id: string,
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

const createInputDataStep = createStep(
    "create-price-tier-input",
    async ({
        category_id,
        name: category_name,
        price_tiers
    }: CreateInputDataStepInput, { container }) => {
        const categorySlug = category_name
            .toLowerCase()                      // convert to lowercase
            .trim()                             // trim leading/trailing whitespace
            .replace(/['"]/g, '')               // remove apostrophes and quotes
            .replace(/[^a-z0-9]+/g, '-')         // replace non-alphanumeric characters with hyphens
            .replace(/^-+|-+$/g, '');            // remove leading/trailing hyphens

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(now.getFullYear());

        const priceTiersInputData = price_tiers.map((priceTier) => {
            const { delivery_schedule_title, ...createPlanInput } = priceTier;
            const deliverySlug = delivery_schedule_title
                .toLowerCase()                      // convert to lowercase
                .trim()                             // trim leading/trailing whitespace
                .replace(/['"]/g, '')               // remove apostrophes and quotes
                .replace(/[^a-z0-9]+/g, '-')         // replace non-alphanumeric characters with hyphens
                .replace(/^-+|-+$/g, '');            // remove leading/trailing hyphens
            const customer_group_name = `${categorySlug}-${priceTier.meals_per_week}-meals-${deliverySlug}-${day}-${month}-${year}`;
            return {
                ...createPlanInput,
                category: category_id,
                customer_group_name,
            }
        })

        const customerGroupNames = priceTiersInputData.map((priceTier) => {
            return {
                name: priceTier.customer_group_name
            }
        });

        

        return new StepResponse({
            price_tier_input_data: priceTiersInputData,
            customer_group_input_data: customerGroupNames,
        })
    },
)

export default createInputDataStep