import { Module } from "@medusajs/framework/utils"
import GuestModuleService from "./service"

export const GUEST_MODULE = "guest"

export default Module(GUEST_MODULE, {
  service: GuestModuleService,
})