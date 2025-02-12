import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import createDeliveryPlanWorkflow from "src/workflows/subscription-module/create-delivery-plan";
import createPriceTiersWorkflow from "src/workflows/subscription-module/create-price-tiers";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["ca"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "GTA Based Website",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "GTA Based Website",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Canada",
          currency_code: "cad",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Mamanpaz Meals Store",
        supported_currencies: [
          {
            currency_code: "cad",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
        default_region_id: region.id
      },
    },
  });

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Northern Torontonian Kitchen",
          address: {
            city: "Newmarket",
            country_code: "CA",
            address_1: "271 Rhodes Circle",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const { result: shippingProfileResult } =
    await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default",
            type: "default",
          },
        ],
      },
    });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Northern Torontonian kitechen delivery",
    type: "shipping",
    service_zones: [
      {
        name: "GTA",
        geo_zones: [
          {
            city: "Toronto",
            province_code: "ON",
            country_code: "CA",
            type: "city",
          },
          {
            city: "Newmarket",
            province_code: "ON",
            country_code: "CA",
            type: "city",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "cad",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: '"true"',
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "cad",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: '"true"',
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "Saman Saryazdi",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

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
        {
          name: "Extra Meal",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Extra Meal",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Extra Meal")!.id,
          ],
          description:
            "Try our meals before you commit to a plan.",
          handle: "extra-meal",
          options: [{
            title: "Default",
            values: ["Default"],
          }],
          variants: [{
            title: "Extra Meal",
            options: {
              Default: "Default",
            },
            prices: [{
              currency_code: "cad",
              amount: 22,
            }],
            manage_inventory: false,
          }],
          status: ProductStatus.PUBLISHED,
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

  logger.info("Seeding delivery data...");

  const { result: deliver_biweekly } = await createDeliveryPlanWorkflow(container).run({
    input: {
      name: "Biweekly",
      day_one: 3,
      day_four: 4,
    },
  })

  const { result: deliver_triweekly } = await createDeliveryPlanWorkflow(container).run({
    input: {
      name: "Triweekly",
      day_one: 2,
      day_three: 2,
      day_five: 3,
    },
  })

  const { result: deliver_daily } = await createDeliveryPlanWorkflow(container).run({
    input: {
      name: "Daily",
      day_one: 1,
      day_two: 1,
      day_three: 1,
      day_four: 1,
      day_five: 1,
      day_six: 1,
      day_seven: 1,
    },
  })
  logger.info("Finished seeding delivery data.");

  logger.info("Seeding meal plan data...");

  await createPriceTiersWorkflow(container).run({
    input: {
      name: "Maman's Care Package",
      price_tiers: [
        {
          name: "1 Meal/Day",
          slug: "one-meal-biweekly",
          meals_per_week: 7,
          meals_per_day: 1,
          price_per_meal: 16.50,
          delivery_schedule_id: deliver_biweekly.id,
          delivery_schedule_title: deliver_biweekly.title
        },
        {
          name: "1 Meal/Day",
          slug: "one-meal-triweekly",
          meals_per_week: 7,
          meals_per_day: 1,
          price_per_meal: 18.50,
          delivery_schedule_id: deliver_triweekly.id,
          delivery_schedule_title: deliver_triweekly.title
        },
        {
          name: "1 Meal/Day",
          slug: "one-meal-daily",
          meals_per_week: 7,
          meals_per_day: 1,
          price_per_meal: 20.50,
          delivery_schedule_id: deliver_daily.id,
          delivery_schedule_title: deliver_daily.title
        },
        {
          name: "2 Meals/Day",
          slug: "two-meals-biweekly",
          meals_per_week: 14,
          meals_per_day: 2,
          price_per_meal: 16,
          delivery_schedule_id: deliver_biweekly.id,
          delivery_schedule_title: deliver_biweekly.title
        },
        {
          name: "2 Meals/Day",
          slug: "two-meals-triweekly",
          meals_per_week: 14,
          meals_per_day: 2,
          price_per_meal: 18,
          delivery_schedule_id: deliver_triweekly.id,
          delivery_schedule_title: deliver_triweekly.title
        },
        {
          name: "2 Meals/Day",
          slug: "two-meals-daily",
          meals_per_week: 14,
          meals_per_day: 2,
          price_per_meal: 20,
          delivery_schedule_id: deliver_daily.id,
          delivery_schedule_title: deliver_daily.title
        },
        {
          name: "3 Meals/Day",
          slug: "three-meals-biweekly",
          meals_per_week: 21,
          meals_per_day: 3,
          price_per_meal: 15.50,
          delivery_schedule_id: deliver_biweekly.id,
          delivery_schedule_title: deliver_biweekly.title
        },
        {
          name: "3 Meals/Day",
          slug: "three-meals-triweekly",
          meals_per_week: 21,
          meals_per_day: 3,
          price_per_meal: 17.50,
          delivery_schedule_id: deliver_triweekly.id,
          delivery_schedule_title: deliver_triweekly.title
        },
        {
          name: "3 Meals/Day",
          slug: "three-meals-daily",
          meals_per_week: 21,
          meals_per_day: 3,
          price_per_meal: 19.50,
          delivery_schedule_id: deliver_daily.id,
          delivery_schedule_title: deliver_daily.title
        },
        {
          name: "4 Meals/Day",
          slug: "four-meals-biweekly",
          meals_per_week: 28,
          meals_per_day: 4,
          price_per_meal: 15,
          delivery_schedule_id: deliver_biweekly.id,
          delivery_schedule_title: deliver_biweekly.title
        },
        {
          name: "4 Meals/Day",
          slug: "four-meals-triweekly",
          meals_per_week: 28,
          meals_per_day: 4,
          price_per_meal: 17,
          delivery_schedule_id: deliver_triweekly.id,
          delivery_schedule_title: deliver_triweekly.title
        },
        {
          name: "4 Meals/Day",
          slug: "four-meals-daily",
          meals_per_week: 28,
          meals_per_day: 4,
          price_per_meal: 19,
          delivery_schedule_id: deliver_daily.id,
          delivery_schedule_title: deliver_daily.title
        },
      ],
    },
  })

  logger.info("Finished seeding delivery data.");

}
