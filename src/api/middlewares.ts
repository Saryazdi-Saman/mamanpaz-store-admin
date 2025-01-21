import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http";
import { createDeliveryPlanSchema, createPriceTierSchema, queryPriceTiersSchema } from "./validation-schemas";

export default defineMiddlewares({
    routes: [
        {
            matcher: "/admin/price-tiers",
            method: "POST",
            middlewares: [
                validateAndTransformBody(createPriceTierSchema),
            ]
        },
        // {
        //     matcher: "/admin/price-tiers",
        //     method: "GET",
        //     middlewares: [
        //         validateAndTransformBody(queryPriceTiersSchema),
        //     ]
        // },
        {
            matcher: "/admin/delivery",
            method: "POST",
            middlewares: [
                validateAndTransformBody(createDeliveryPlanSchema),
            ]
        },
    ],
})