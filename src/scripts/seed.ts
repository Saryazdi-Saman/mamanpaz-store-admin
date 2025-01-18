import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "cad",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Plans",
          is_active: true,
        },
        {
          name: "Meals",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Homemade Meals",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Plans")!.id,
          ],
          description:
            "Maman's selection of meals for your everyday needs.",
          handle: "homemade-meals",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Size",
              values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            },
          ],
          variants: [
            {
              title: "1 Meal a Day",
              sku: "MEAL-1",
              options: {
                Size: "1",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "2 Meals a Day",
              sku: "MEAL-2",
              options: {
                Size: "2",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "3 Meals a Day",
              sku: "MEAL-3",
              options: {
                Size: "3",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "4 Meals a Day",
              sku: "MEAL-4",
              options: {
                Size: "4",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "5 Meals a Day",
              sku: "MEAL-5",
              options: {
                Size: "5",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "6 Meals a Day",
              sku: "MEAL-6",
              options: {
                Size: "6",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "7 Meals a Day",
              sku: "MEAL-7",
              options: {
                Size: "7",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "8 Meals a Day",
              sku: "MEAL-8",
              options: {
                Size: "8",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "9 Meals a Day",
              sku: "MEAL-9",
              options: {
                Size: "9",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
            {
              title: "10 Meals a Day",
              sku: "MEAL-10",
              options: {
                Size: "10",
              },
              prices: [
                {
                  amount: 10,
                  currency_code: "cad",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");
}
