import { Logger, ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/framework/types";
import { AbstractNotificationProviderService } from "@medusajs/framework/utils";
import twilio from 'twilio'

type InjectedDependencies = {
    logger: Logger
}

type Options = {
    accountSid: string
    authToken: string
    twilioNumber: string
}

class TwilioSmsService extends AbstractNotificationProviderService {
    static identifier = "twilio-sms"
    
    protected options_: Options
    protected logger_: Logger
    protected twilioNumber_: string
    protected twilioClient: any

    constructor(
        { logger }: InjectedDependencies, 
        options: Options
    ) {
        super()

        this.options_ = options
        this.logger_ = logger
        this.twilioClient = twilio(options.accountSid, options.authToken)
    }

    async send(
        notification: ProviderSendNotificationDTO
      ): Promise<ProviderSendNotificationResultsDTO> {
        return this.twilioClient.messages.create({
            body: notification.template,
            from: this.options_.twilioNumber,
            to: notification.to,
        })
      
    }

    static validateOptions(options: Record<string, unknown>): void {
        if (!options.accountSid) {
            throw new Error("Twilio account SID is required")
        }
        if (!options.authToken) {
            throw new Error("Twilio auth token is required")
        }
        // Add more validation as needed
    }

}

export default TwilioSmsService