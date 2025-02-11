import { InferTypeOf, LinkDefinition } from "@medusajs/framework/types";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { SUBSCRIPTION_MODULE } from "src/modules/subscription";
import SubscriptionModuleService from "src/modules/subscription/service";
import { SubscriptionStatus } from "src/modules/subscription/types";
import moment from "moment"
import { Modules } from "@medusajs/framework/utils";
import Subscription from "src/modules/subscription/models/subscription";

type StepInput = {
    cart_id: string,
    order_id: string,
    customer_id?: string,
    subscription_data: {
        start_date: Date,
        next_shipping_date: Date,
        status: SubscriptionStatus.ACTIVE | SubscriptionStatus.PENDING,
        plan_id: string,
    }
}

const createSubscriptionStep = createStep(
    "create-subscription-step",
    async ({
        cart_id,
        order_id,
        customer_id,
        subscription_data
    }: StepInput, { container }) => {
        const subscriptionModuleService: SubscriptionModuleService =
            container.resolve(SUBSCRIPTION_MODULE)
        const linkDefs: LinkDefinition[] = []

        const nextOrderMoment = subscription_data.status === SubscriptionStatus.ACTIVE ?
            moment(subscription_data.next_shipping_date).add(5, 'days') :
            moment(subscription_data.start_date)

        const subscription: InferTypeOf<typeof Subscription>[] = await subscriptionModuleService.createSubscriptions({
            ...subscription_data,
            next_order_date: nextOrderMoment.toDate(),
            metadata: {
                main_order_id: order_id
            }
        })

        linkDefs.push({
            [SUBSCRIPTION_MODULE]: {
                "subscription_id": subscription[0].id,
            },
            [Modules.ORDER]: {
                "order_id": order_id,
            },
        })

        linkDefs.push({
            [SUBSCRIPTION_MODULE]: {
                "subscription_id": subscription[0].id,
            },
            [Modules.CART]: {
                "cart_id": cart_id,
            },
        })
        
        if (customer_id) {
            linkDefs.push({
                [SUBSCRIPTION_MODULE]: {
                    "subscription_id": subscription[0].id,
                },
                [Modules.CUSTOMER]: {
                    "customer_id": customer_id,
                },
            })
        }

        return new StepResponse({
            subscription: subscription[0],
            linkDefs,
        }, {
            subscription: subscription[0],
        })
    }, async (input, { container }) => {
        const subscriptionModuleService: SubscriptionModuleService =
            container.resolve(SUBSCRIPTION_MODULE)
        if (input) {
            await subscriptionModuleService.deleteSubscriptions(input.subscription.id)
        }
    }
)

export default createSubscriptionStep