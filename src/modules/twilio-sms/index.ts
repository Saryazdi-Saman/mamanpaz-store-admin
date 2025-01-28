import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import TwilioSmsService from "./service";

export default ModuleProvider(Modules.NOTIFICATION, {
    services: [TwilioSmsService]
})