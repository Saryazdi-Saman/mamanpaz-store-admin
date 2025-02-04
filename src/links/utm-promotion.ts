import { defineLink } from "@medusajs/framework/utils";
import PromotionModule from "@medusajs/medusa/promotion";
import GuestModule from "src/modules/guest";

export default defineLink(
    {
        linkable: GuestModule.linkable.utmSource,
        isList: true,
    },
    PromotionModule.linkable.promotion,
)