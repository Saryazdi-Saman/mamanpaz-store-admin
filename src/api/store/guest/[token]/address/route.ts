import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { GUEST_MODULE } from "src/modules/guest";
import { OnboardingStage } from "src/modules/guest/types";
import updateGuestWorkflow from "src/workflows/guest-module/update-guest";

type PostRequestBody = {
    name: string,
    lastname: string,
    address_line1: string,
    address_line2?: string,
    address_line3?: string,
    postal_code: string,
    city: string,
    district?: string,
    country: string,
    neighborhood?: string,
    region: string,
}

export const POST = async (
    req: MedusaRequest<PostRequestBody>,
    res: MedusaResponse
) => {
    const { token } = req.params;
    const guestModule = req.scope.resolve(GUEST_MODULE);
    const existingGuest = await guestModule.listGuests({
        token,
    })
    if (!existingGuest || existingGuest.length === 0) {
        return res.status(200).json({
            success: false,
            error: "GUEST_NOT_FOUND",
        })
    }
    const { errors } = await updateGuestWorkflow(req.scope)
    .run({
        input: {
            token,
            next_stage: OnboardingStage.PAYMENT,
            updates: {
                name: req.body.name,
                last_name: req.body.lastname,
                address_line1: req.body.address_line1,
                address_line2: req.body.address_line2,
                address_line3: req.body.address_line3,
                postal_code: req.body.postal_code,
                city: req.body.city,
                province: req.body.region,
                country: req.body.country,
                neighborhood: req.body.neighborhood,
                region: req.body.region,
                district: req.body.district
            }
        }
    })

    if (errors && errors.length > 0) {
        return res.status(200).json({
            success: false,
            error: "OTHER",
        })
    }
    return res.status(200).json({
        success: true,
    })
}