import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http";
import { createPriceTierSchema, queryPriceTiersSchema } from "./validation-schemas";

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
    ],
})