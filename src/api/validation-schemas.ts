import { z } from "zod";

export const createPriceTierSchema = z.object({
    name: z.string(),
    price_tiers: z.array(z.object({
        name: z.string(),
        slug: z.string(),
        meals_per_day: z.number(),
        price_per_meal: z.number(),
    })),
})

export const queryPriceTiersSchema = z.object({
    id: z.string().nullable(),
})

export const createDeliveryPlanSchema = z.object({
    name: z.string(),
    day_one: z.optional(z.number()),
    day_two: z.optional(z.number()),
    day_three: z.optional(z.number()),
    day_four: z.optional(z.number()),
    day_five: z.optional(z.number()),
    day_six: z.optional(z.number()),
    day_seven: z.optional(z.number()),
})

const test = typeof queryPriceTiersSchema