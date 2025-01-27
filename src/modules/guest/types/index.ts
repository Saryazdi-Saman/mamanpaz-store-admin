export enum OnboardingStage {
    INITIAL = "initial",
    CREDENTIALS = "credentials",
    PERSONAL_INFO = "personal_info",
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