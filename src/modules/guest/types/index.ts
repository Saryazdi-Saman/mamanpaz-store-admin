export enum OnboardingStage {
    INITIAL = "initial",
    CREDENTIALS = "credentials",
    VERIFY_PHONE_NUMBER = "verify_phone_number",
    ADDRESS = "address",
    PAYMENT = "payment",
    COMPLETE = "complete",
}

interface Address {
    street1: string;
    street2?: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
}