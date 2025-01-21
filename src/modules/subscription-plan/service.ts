import { MedusaService } from "@medusajs/framework/utils";
import PlanCategory from "./models/plan-category";
import PriceTier from "./models/price-tier";

class SubscriptionPlanModuleService extends MedusaService ({
    PlanCategory,
    PriceTier,
}){

}

export default SubscriptionPlanModuleService