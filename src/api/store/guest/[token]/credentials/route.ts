import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { OnboardingStage } from "src/modules/guest/types";
import updateGuestWorkflow from "src/workflows/guest-module/update-guest";

enum PostError {
    EMAIL_EXISTS = "EMAIL_EXISTS",
    INVALID_PHONE_NUMBER = "INVALID_PHONE_NUMBER",
    GUEST_NOT_FOUND = "GUEST_NOT_FOUND",
    OTHER = "OTHER",
}

type CredentialsPostRequest = {
    email: string;
    phone_number: string;
    password: string;
}

type CredentialsPostResponse = {
    success: boolean;
    error?: PostError;
    next?: OnboardingStage.VERIFY_PHONE_NUMBER | OnboardingStage.ADDRESS;
}

export const POST = async (
    req: MedusaRequest<CredentialsPostRequest>,
    res: MedusaResponse<CredentialsPostResponse>
) => {
    const { token } = req.params;
    const customerModule = req.scope.resolve(Modules.CUSTOMER);
    const existingCutomer = await customerModule.listCustomers({
        email: req.body.email,
    })

    if (existingCutomer.length > 0) {
        return res.status(409).json({
            success: false,
            error: PostError.EMAIL_EXISTS,
        })
    }

    const query = req.scope.resolve("query");
    const { data: guests } = await query.graph({
        entity: "guest",
        filters: {
            token,
        },
        fields: [
            "id",
            "phone_number",
            "phone_verified",
        ],
    })

    if (guests.length === 0) {
        return res.status(401).json({
            success: false,
            error: PostError.GUEST_NOT_FOUND,
        })
    }

    const guest = guests[0]
    const isVerifiedNumber = guest.phone_number && guest.phone_number === req.body.phone_number && guest.phone_verified
    const nextStep = isVerifiedNumber ? OnboardingStage.ADDRESS : OnboardingStage.VERIFY_PHONE_NUMBER

    const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
    const otp = randomFourDigits.toString().padStart(4, "0");

    const { errors } = await updateGuestWorkflow(req.scope)
        .run({
            input: {
                token,
                next_stage: nextStep,
                updates: {
                    email: req.body.email,
                    phone_number: req.body.phone_number,
                    password: req.body.password,
                    phone_verification_code: otp,
                    last_active_at: new Date(Date.now()),
                }
            }
        })
    if (errors && errors.length > 0) {
        return res.status(500).json({
            success: false,
            error: PostError.OTHER,
        })
    }
    
    if (isVerifiedNumber) {
        return res.status(200).json({
            success: true,
            next: nextStep,
        })
    }

    const notificationModule = req.scope.resolve(Modules.NOTIFICATION)

    try {
        const result = await notificationModule.createNotifications({
            to: req.body.phone_number,
            channel: "sms",
            template: otp + ' is your verification code for MamanPaz Meals',
        })
        if (result.status !== "success") {
            return res.status(400).json({
                success: false,
                error: PostError.INVALID_PHONE_NUMBER,
            })
        }
    } catch (e) {
        // console.log(e)
        return res.status(500).json({
            success: false,
            error: PostError.OTHER
        })
    }

    return res.status(200).json({
        success: true,
        next: nextStep,
    })
}