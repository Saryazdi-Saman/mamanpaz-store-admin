import {
    createWorkflow,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
    createRemoteLinkStep,
    completeCartWorkflow,
    useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import createSubscriptionStep from "./steps/create-subscription"
import { SubscriptionStatus } from "src/modules/subscription/types"

type WorkflowInput = {
    cart_id: string,
    subscription_data: {
        start_date: Date,
        next_shipping_date: Date,
        status: SubscriptionStatus.ACTIVE | SubscriptionStatus.PENDING,
        plan_id: string,
    }
}

const createSubscriptionWorkflow = createWorkflow(
    "create-subscription",
    (input: WorkflowInput) => {
        const { id } = completeCartWorkflow.runAsStep({
            input: {
                id: input.cart_id,
            },
        })

        // @ts-expect-error
        const { data: orders } = useQueryGraphStep({
            entity: "order",
            fields: ["*", "id", "customer_id"],
            filters: {
              id,
            },
            options: {
              throwIfKeyNotFound: true,
            },
          }) 
      

        const { subscription, linkDefs } = createSubscriptionStep({
            cart_id: input.cart_id,
            order_id: orders[0].id,
            customer_id: orders[0].customer_id as string,
            subscription_data: input.subscription_data,
        })

        createRemoteLinkStep(linkDefs)

        return new WorkflowResponse({
            subscription: subscription,
            order: orders[0],
        })
    }
)

export default createSubscriptionWorkflow