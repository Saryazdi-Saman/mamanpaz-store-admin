import { MedusaService } from "@medusajs/framework/utils";
import PlanCategory from "./models/plan-category";
import PriceTier from "./models/price-tier";
import DeliveryPlan from "./models/delivery-plan";

class SubscriptionPlanModuleService extends MedusaService ({
    PlanCategory,
    PriceTier,
    DeliveryPlan,
}){

}

export default SubscriptionPlanModuleService