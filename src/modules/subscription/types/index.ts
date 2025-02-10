export enum ProductType {
    MEAL_PLAN = "meal-plan",
    DELIVERY_PLAN = "delivery-plan",
}

export enum SubscriptionStatus {
    ACTIVE = "active",        // Subscription is running normally
    PENDING = "pending",      // Created but waiting for first payment/activation
    PAST_DUE = "past_due",    // Payment failed but still within retry window
    PAUSED = "paused",        // Temporarily suspended by user
    CANCELED = "canceled",    // Canceled by user but may still be active until end of period
    EXPIRED = "expired",      // Natural end of subscription term
    FAILED = "failed",        // Payment failed and exceeded retry attempts
    UNPAID = "unpaid",        // Has unpaid balance but subscription continues
}

export enum MealboxStatus {
    PENDING = "pending",        // Initial state
    ACTIVE = "active",         // Ready for preparation
    PREPARING = "preparing",   // In kitchen/being assembled
    READY = "ready",          // Ready for delivery
    IN_TRANSIT = "in_transit", // Out for delivery
    DELIVERED = "delivered",   // Successfully delivered
    EXPIRED = "expired",      // Past delivery window
    CANCELED = "canceled"      // Canceled by user/system
}

export enum DayOfWeek {
    MONDAY = "monday",
    TUESDAY = "tuesday",
    WEDNESDAY = "wednesday",
    THURSDAY = "thursday",
    FRIDAY = "friday",
    SATRUDAY = "saturday",
    SUNDAY = "sunday",
}