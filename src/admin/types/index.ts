export type PriceTier = {
    id: string,
    name: string,
    meals_per_week: number,
    meals_per_day: number,
    price_per_meal: number,
    category: string,
}

export type PlanCategory = {
    id: string,
    name: string,
    is_active: boolean,
    price_tiers: PriceTier[],
    product: {
        id: string,
    }
}

export type DeliveryPlan = {
    id: string,
    name: string,
    is_active: boolean,
    price: number,
    monday: number,
    tuesday: number,
    wednesday: number,
    thursday: number,
    friday: number,
    saturday: number,
    sunday: number,
    product_variant: {
        id: string,
        product_id: string,
    }
}