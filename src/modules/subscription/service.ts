import { MedusaService } from "@medusajs/framework/utils";
import PlanCategory from "./models/plan-category";
import Plan from "./models/plan";
import DeliveryPlan from "./models/delivery-plan";

class SubscriptionModuleService extends MedusaService ({
    PlanCategory,
    Plan,
    DeliveryPlan,
}){

}

export default SubscriptionModuleService