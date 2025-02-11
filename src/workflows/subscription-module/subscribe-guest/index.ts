import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { CartDTO, InferTypeOf } from "@medusajs/types";
import { Guest } from "src/modules/guest/models/guest";

type WorkflowInput = {
    cart_id: string,
    guest: InferTypeOf<typeof Guest>
    auth_identity_id: string
}

const subscribeGuestWorkflow = createWorkflow(
    "subscribe-guest",
    (input: WorkflowInput) => {
        // STEP 1: Retrieve Plan from Cart
        // STEP 2: Create Customer Account 
        // STEP 3: Add Customer to Customer Group
        // STEP 4: Link Customer and Cart
        // Step 5: Add Payment Session to Cart
        // STEP 6: Create Subscription
        // STEP 7: Create BoxTemplate
        // STEP 8: Create MealBoxes
        // STEP 9: Create Order
        // STEP 10: Link Subscription with Customer, Cart, Order
    }
)

export default subscribeGuestWorkflow