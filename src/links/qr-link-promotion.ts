import { defineLink } from "@medusajs/framework/utils";
import PromotionModule from "@medusajs/medusa/promotion";
import MarketingModule from "src/modules/marketing";

export default defineLink(
    {
        linkable: MarketingModule.linkable.qrLink,
        isList: true,
    },
    PromotionModule.linkable.promotion,
)