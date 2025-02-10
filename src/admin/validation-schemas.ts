import { z } from "zod";
import { UTM_Content, UTM_Medium, UTM_Source } from "./types";

const slugify = (str: string) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')    // Remove special characters
        .replace(/[\s_-]+/g, '-')    // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens
};

export const PriceTierSchema = z.object({
    name: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Name is required"),
    slug: z.string()
        .transform(val => slugify(val))
        .refine(val => val.length > 0, "slug is required"),
    delivery_schedule_id: z.string().trim().nonempty("Delivery schedule is required"),
    delivery_schedule_title: z.string().trim().nonempty("Delivery schedule is required"),
    meals_per_day: z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(z.number()),
    price_per_meal: z.string()
        .transform((val) => {
            const number = parseFloat(val);
            return number;
        })
        .pipe(
            z.number()
                .positive("Price must be greater than 0")
                .multipleOf(0.01, "Price must have at most 2 decimal places")
        )
});

export const PriceTierInputFieldsSchema = PriceTierSchema.partial()

export const PriceTiersArraySchema = z.array(PriceTierSchema)
    .nonempty("Must provide at least 1 price tier")
    .refine(
        (tiers) => {
            const slugs = new Set(tiers.map(tier => tier.slug.trim()));
            return slugs.size === tiers.length;
        },
        "Each tier must have a unique name"
    );

export const PackageTitleSchema = z.string().min(1, "Name is required")

export const CreatePlanPackageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price_tiers: z.array(PriceTierSchema)
        .nonempty("Must provide at least 1 price tier"),
})

export const CreateDeliveryPlanSchema = z.object({
    name: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Name is required"),
    day_one: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_two: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_three: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_four: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_five: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_six: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
    day_seven: z.optional(z.string()
        .transform(val => {
            if (!val) return undefined;
            const number = parseInt(val);
            return number;
        })
        .pipe(
            z.optional(z.number())
        )),
})

export const CreateCampaignSchema = z.object({
    name: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Name is required"),
    campaign: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Campaign is required"),
    campaign_id: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Campaign is required"),
    promotion: z.string().nullable(),
    medium: z.nativeEnum(UTM_Medium),
    source: z.nativeEnum(UTM_Source),
    content: z.nativeEnum(UTM_Content),
    term: z.string().nullable(),
    code: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Short link is required"),
    destination_url: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Redirect destination is required"),
})

export const CreatePlanSchema = z.object({
    title: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Title is required"),
    product_id: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Product is required"),
})