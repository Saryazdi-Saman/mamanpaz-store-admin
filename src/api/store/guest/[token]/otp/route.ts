import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { OnboardingStage } from "src/modules/guest/types";
import updateGuestWorkflow from "src/workflows/guest-module/update-guest";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { token } = req.params;
    const query = req.scope.resolve("query");
    const {
        data: guests,
    } = await query.graph({
        entity: "guest",
        fields: [
            "phone_verification_code",
            "phone_number",
        ],
        filters: {
            token,
        },
    });

    if (guests.length === 0) {
        return res.status(401).json({
            success: false,
            error: "GUEST_NOT_FOUND",
        });
    }

    const guest = guests[0];
    const notificationModule = req.scope.resolve(Modules.NOTIFICATION);
    if (guest.phone_number && guest.phone_verification_code) {
        try {
            const result = await notificationModule.createNotifications({
                to: guest.phone_number,
                channel: "sms",
                template: guest.phone_verification_code + ' is your verification code for MamanPaz Meals',
            });
        } catch {
            return res.status(500).json({
                success: false,
                error: "OTHER",
            });
        }
    }
    return res.status(500).json({
        success: false,
        error: "OTHER",
    });
}

type OTPPostRequest = {
    otp: string;
};

type OTPPostResponse = {
    success: boolean;
    error?: string;
};

export const POST = async (
    req: MedusaRequest<OTPPostRequest>,
    res: MedusaResponse<OTPPostResponse>
) => {
    const { token } = req.params;
    const query = req.scope.resolve("query");
    console.log("req.body", req.body);
    console.log("OTP", req.body.otp)
    const {
        data: guests,
    } = await query.graph({
        entity: "guest",
        fields: [
            "phone_verification_code",
        ],
        filters: {
            token,
        },
    });

    if (guests.length === 0) {
        return res.status(401).json({
            success: false,
            error: "GUEST_NOT_FOUND",
        });
    }

    const guest = guests[0];
    if (guest.phone_verification_code === req.body.otp) {
        const { errors } = await updateGuestWorkflow(req.scope)
            .run({
                input: {
                    token,
                    next_stage: OnboardingStage.ADDRESS,
                    updates: {
                        phone_verified: true,
                        last_active_at: new Date(Date.now()),
                    }
                }
            })
        if (errors && errors.length > 0) {
            return res.status(500).json({
                success: false,
                error: "OTHER",
            })
        }
        return res.status(200).json({
            success: true,
        });
    } else {
        return res.status(400).json({
            success: false,
            error: "INVALID_OTP",
        });
    }
}