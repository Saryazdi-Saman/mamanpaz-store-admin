import { z } from "zod";

export const PriceTierSchema = z.object({
    name: z.string()
        .transform(val => val.trim())
        .refine(val => val.length > 0, "Name is required"),
    meals_per_day: z.number()
        .int("Must be a whole number")
        .min(1, "Must provide at least 1 meal per day"),
    price_per_meal: z.string()
    .transform((val) => {
      const number = parseFloat(val);
      return isNaN(number) ? 1 : number;
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
            const names = new Set(tiers.map(tier => tier.name.trim()));
            return names.size === tiers.length;
        },
        "Each tier must have a unique name"
    );

export const PackageTitleSchema = z.string().min(1, "Name is required")

export const CreatePlanPackageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price_tiers: z.array(PriceTierSchema)
        .nonempty("Must provide at least 1 price tier"),
})