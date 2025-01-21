export type PriceTier = {
    id: string,
    name: string,
    meals_per_week: number,
    meals_per_day: number,
    price_per_meal: number,
    category: string,
}

// export type PriceTierCategory = {
//     id: string,
//     name: string,
//     price_tiers?: PriceTier[],
// }

export type PlanCategory = {
    id: string,
    name: string,
    is_active: boolean,
    price_tiers: PriceTier[],
    product: {
        id: string,
    }
}