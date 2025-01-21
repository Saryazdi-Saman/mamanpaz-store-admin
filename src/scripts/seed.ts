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
  const productModuleService = container.resolve(Modules.PRODUCT);

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

  // await updateStoresWorkflow(container).run({
  //   input: {
  //     selector: { id: store.id },
  //     update: {
  //       supported_currencies: [
  //         {
  //           currency_code: "cad",
  //           is_default: true,
  //         },
  //       ],
  //       default_sales_channel_id: defaultSalesChannel[0].id,
  //     },
  //   },
  // });

  logger.info("Seeding product data...");

  // const { result: categoryResult } = await createProductCategoriesWorkflow(
  //   container
  // ).run({
  //   input: {
  //     product_categories: [
  //       {
  //         name: "Plans",
  //         is_active: true,
  //       },
  //       {
  //         name: "Meals",
  //         is_active: true,
  //       },
  //     ],
  //   },
  // });

  const categories = await productModuleService.listProductCategories();

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Meal Subscription Plan",
          category_ids: [
            // categoryResult.find((cat) => cat.name === "Plans")!.id,
            categories[0].id,
          ],
          description:
            "Meal Subscription Plan",
          handle: "meal-subscription-plan",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Quantity",
              values: ["1 meal/day", "2 meals/day", "3 meals/day", "4 meals/day", "5 meals/day", "6 meals/day", "7 meals/day", "8 meals/day", "9 meals/day", "10 meals/day"],
            },
          ],
          variants: [
            {
              title: "1 meal/day",
              sku: "ONE-MEAL-DAY",
              options: {
                Quantity: "1 meal/day",
              },
              prices: [
                {
                  amount: 90.93,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 1,
                meals_per_week: 7,
                price_per_meal: 12.99,
              },
            },
            {
              title: "2 meals/day",
              sku: "TWO-MEAL-DAY",
              options: {
                Quantity: "2 meals/day",
              },
              prices: [
                {
                  amount: 177.24,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 2,
                meals_per_week: 14,
                price_per_meal: 12.66,
              },
            },
            {
              title: "3 meals/day",
              sku: "THREE-MEAL-DAY",
              options: {
                Quantity: "3 meals/day",
              },
              prices: [
                {
                  amount: 258.93,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 3,
                meals_per_week: 21,
                price_per_meal: 12.33,
              },
            },
            {
              title: "4 meals/day",
              sku: "FOUR-MEAL-DAY",
              options: {
                Quantity: "4 meals/day",
              },
              prices: [
                {
                  amount: 335.72,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 4,
                meals_per_week: 28,
                price_per_meal: 11.99,
              },
            },
            {
              title: "5 meals/day",
              sku: "FIVE-MEAL-DAY",
              options: {
                Quantity: "5 meals/day",
              },
              prices: [
                {
                  amount: 408.10,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 5,
                meals_per_week: 35,
                price_per_meal: 11.66,
              },
            },
            {
              title: "6 meals/day",
              sku: "SIX-MEAL-DAY",
              options: {
                Quantity: "6 meals/day",
              },
              prices: [
                {
                  amount: 475.86,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 6,
                meals_per_week: 42,
                price_per_meal: 11.33,
              },
            },
            {
              title: "7 meals/day",
              sku: "SEVEN-MEAL-DAY",
              options: {
                Quantity: "7 meals/day",
              },
              prices: [
                {
                  amount: 538.51,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 7,
                meals_per_week: 49,
                price_per_meal: 10.99,
              },
            },
            {
              title: "8 meals/day",
              sku: "EIGHT-MEAL-DAY",
              options: {
                Quantity: "8 meals/day",
              },
              prices: [
                {
                  amount: 596.96,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 8,
                meals_per_week: 56,
                price_per_meal: 10.66,
              },
            },
            {
              title: "9 meals/day",
              sku: "NINE-MEAL-DAY",
              options: {
                Quantity: "9 meals/day",
              },
              prices: [
                {
                  amount: 650.79,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 9,
                meals_per_week: 63,
                price_per_meal: 10.33,
              },
            },
            {
              title: "10 meals/day",
              sku: "TEN-MEAL-DAY",
              options: {
                Quantity: "10 meals/day",
              },
              prices: [
                {
                  amount: 700.00,
                  currency_code: "cad",
                },
              ],
              manage_inventory: false,
              metadata: {
                meals_per_day: 10,
                meals_per_week: 70,
                price_per_meal: 10.00,
              },
            },
          ],
        },
        // {
        //   title: "Delivery Schedule",
        //   category_ids: [
        //     categoryResult.find((cat) => cat.name === "Plans")!.id,
        //   ],
        //   description:
        //     "Delivery schedule for your meals.",
        //   handle: "delivery-schedule",
        //   status: ProductStatus.PUBLISHED,
        //   options: [
        //     {
        //       title: "frequency",
        //       values: ["bi-weekly", "tri-weekly", "daily"],
        //     },
        //   ],
        //   variants: [
        //     {
        //       title: "bi-weekly",
        //       sku: "BIWEEKLY",
        //       options: {
        //         frequency: "bi-weekly",
        //       },
        //       prices: [
        //         {
        //           amount: 9.99,
        //           currency_code: "cad",
        //         },
        //       ],
        //       metadata: {
        //         schedule: {
        //           monday: 3,
        //           thrusday: 4,
        //         }
        //       }
        //     },
        //     {
        //       title: "tri-weekly",
        //       sku: "TRIWEEKLY",
        //       options: {
        //         frequency: "tri-weekly",
        //       },
        //       prices: [
        //         {
        //           amount: 14.99,
        //           currency_code: "cad",
        //         },
        //       ],
        //       metadata: {
        //         schedule: {
        //           monday: 2,
        //           wednesday: 2,
        //           friday: 3,
        //         }
        //       }
        //     },
        //     {
        //       title: "daily",
        //       sku: "DAILY",
        //       options: {
        //         frequency: "daily",
        //       },
        //       prices: [
        //         {
        //           amount: 19.99,
        //           currency_code: "cad",
        //         },
        //       ],
        //       metadata: {
        //         schedule: {
        //           monday: 1,
        //           tuesday: 1,
        //           wednesday: 1,
        //           thursday: 1,
        //           friday: 1,
        //           saturday: 1,
        //           sunday: 1,
        //         }
        //       }
        //     },
        //   ],
        // },
        // {
        //   title: "Homemade Meals",
        //   category_ids: [
        //     categoryResult.find((cat) => cat.name === "Plans")!.id,
        //   ],
        //   description:
        //     "Maman's selection of meals for your everyday needs.",
        //   handle: "homemade-meals",
        //   status: ProductStatus.PUBLISHED,
        //   options: [
        //     {
        //       title: "Size",
        //       values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        //     },
        //   ],
        //   variants: [
        //     {
        //       title: "1 Meal a Day",
        //       sku: "MEAL-1",
        //       options: {
        //         Size: "1",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "2 Meals a Day",
        //       sku: "MEAL-2",
        //       options: {
        //         Size: "2",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "3 Meals a Day",
        //       sku: "MEAL-3",
        //       options: {
        //         Size: "3",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "4 Meals a Day",
        //       sku: "MEAL-4",
        //       options: {
        //         Size: "4",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "5 Meals a Day",
        //       sku: "MEAL-5",
        //       options: {
        //         Size: "5",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "6 Meals a Day",
        //       sku: "MEAL-6",
        //       options: {
        //         Size: "6",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "7 Meals a Day",
        //       sku: "MEAL-7",
        //       options: {
        //         Size: "7",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "8 Meals a Day",
        //       sku: "MEAL-8",
        //       options: {
        //         Size: "8",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "9 Meals a Day",
        //       sku: "MEAL-9",
        //       options: {
        //         Size: "9",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //     {
        //       title: "10 Meals a Day",
        //       sku: "MEAL-10",
        //       options: {
        //         Size: "10",
        //       },
        //       prices: [
        //         {
        //           amount: 10,
        //           currency_code: "cad",
        //         },
        //       ],
        //     },
        //   ],
        //   sales_channels: [
        //     {
        //       id: defaultSalesChannel[0].id,
        //     },
        //   ],
        // },
      ],
    },
  });
  logger.info("Finished seeding product data.");
}
