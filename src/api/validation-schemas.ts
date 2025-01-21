import { z } from "zod";

export const createPriceTierSchema = z.object({
    name: z.string(),
    price_tiers: z.array(z.object({
        name: z.string(),
        meals_per_day: z.number(),
        price_per_meal: z.number(),
    })),
})

export const queryPriceTiersSchema = z.object({
    id: z.string().nullable(),
})

const test = typeof queryPriceTiersSchema