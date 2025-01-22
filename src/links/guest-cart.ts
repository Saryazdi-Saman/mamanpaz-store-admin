import { defineLink } from "@medusajs/framework/utils";
import CartModule from "@medusajs/medusa/cart";
import GuestModuleService from "src/modules/guest";

export default defineLink(
    GuestModuleService.linkable.guest,
    CartModule.linkable.cart,
)