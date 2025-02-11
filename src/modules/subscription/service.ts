import { MedusaService } from "@medusajs/framework/utils";
import PlanCategory from "./models/plan-category";
import Plan from "./models/plan";
import DeliveryPlan from "./models/delivery-plan";
import Subscription from "./models/subscription";
import BoxTemplate from "./models/box-template";

class SubscriptionModuleService extends MedusaService ({
    PlanCategory,
    Plan,
    DeliveryPlan,
    Subscription,
    BoxTemplate
}){
}

export default SubscriptionModuleService