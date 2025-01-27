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
    slug: z.string(),
    price: z.number(),
    monday: z.optional(z.number()),
    tuesday: z.optional(z.number()),
    wednesday: z.optional(z.number()),
    thursday: z.optional(z.number()),
    friday: z.optional(z.number()),
    saturday: z.optional(z.number()),
    sunday: z.optional(z.number()),
})

const test = typeof queryPriceTiersSchema