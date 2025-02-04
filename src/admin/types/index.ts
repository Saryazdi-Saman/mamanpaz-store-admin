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
// WHO sent the traffic? (The specific platform or origin)
export enum UTM_Source {
    GOOGLE = "google", // Google Ads, Organic Search
    FACEBOOK = "facebook", // Facebook Ads, Social Posts
    INSTAGRAM = "instagram", // Instagram Posts, Ads
    TIKTOK = "tiktok", // TikTok Ads, Videos
    LINKEDIN = "linkedin", // LinkedIn Marketing
    TWITTER = "twitter", // Twitter/X Marketing
    NEWSLETTER = "newsletter", // Email Newsletter
    SMS = "mamanpaz_sms", // SMS Campaigns (customized name)
    REFERRAL_PROGRAM = "referral_program", // Referral-based tracking
    DIRECT = "direct", // Direct visit (typing URL)
    PRINT = "print", // Physical print marketing (Flyers, Posters)
    RESTAURANT = "restaurant", // Restaurant partnerships, in-store promotions
    OTHER = "other" // Catch-all for unclassified sources
}

// HOW did they get there? (The marketing channel or format)
export enum UTM_Medium {
    CPC = "cpc", // Paid search ads (Google, Bing)
    SOCIAL = "social", // Organic social media traffic
    EMAIL = "email", // Email campaigns
    SMS = "sms", // SMS marketing
    PRINT = "print", // Physical media (flyers, posters, business cards)
    QR = "qr", // QR codes (used across flyers, posters, restaurant tables)
    REFERRAL = "referral", // Referral links from external sources
    ORGANIC = "organic", // Organic search (Google, Bing, etc.)
    DISPLAY = "display", // Banner ads, visual ads
    PUSH = "push", // Push notifications
    NONE = "none" // Direct visits (no tracking)
}

//  utm_content → WHAT variation was used? (The creative, placement, or offer)
export enum UTM_Content {
    AREZOU_A = "arezou_a", // Arezou A
    AREZOU_B = "arezou_b", // Arezou B
    AREZOU_C = "arezou_c", // Arezou C
    AREZOU_D = "arezou_d", // Arezou D
    YASER_A = "yaser_a", // Yaser A
    YASER_B = "yaser_b", // Yaser B
    YASER_C = "yaser_c", // Yaser C
    YASER_D = "yaser_d", // Yaser D
    // FLYER_FRONT = "flyer_front", // Front side of a flyer
    // FLYER_BACK = "flyer_back", // Back side of a flyer
    // DISCOUNT_SECTION = "discount_section", // Discount code placement
    // CTA_BUTTON = "cta_button", // Call-to-action button
    // HEADER_BANNER = "header_banner", // Website header banner
    // SIDEBAR_AD = "sidebar_ad", // Sidebar ad variation
    // EMAIL_SIGNATURE = "email_signature", // Link in email signature
    // STORY_AD = "story_ad", // Social media story ad
    // FEED_POST = "feed_post", // Social media feed post
    // IMAGE_AD = "image_ad", // Display ad with an image
    // VIDEO_AD = "video_ad", // Video advertisement
    // TEST_A = "test_a", // A/B testing variation A
    // TEST_B = "test_b", // A/B testing variation B
    // OTHER = "other" // Catch-all for variations not listed
  }