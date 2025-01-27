import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const {
        data: options,
    } = await query.graph({
        entity: "delivery_plans",
        fields: [
            "id",
            "name",
            "slug",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
            "price",
            "product_variant.id"
        ],
        filters: {
            is_active: true,
        }
        // pagination: {
        //     skip: 0,
        //     order: {
        //         meals_per_day: "ASC"
        //     }
        // }

    })
    res.json({
        delivery_options: options,
    })
}