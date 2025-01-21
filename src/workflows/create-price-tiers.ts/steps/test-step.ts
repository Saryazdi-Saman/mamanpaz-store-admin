import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
type TestStepInput = {
    testData1: any,
    testData2: any,
}
const testStep = createStep(
    "test-step",
    async (data: TestStepInput, { container }) => {
        console.log("TEST STEP")
        console.log(data.testData1)
        console.log(data.testData2)
        return new StepResponse({})
    }
)

export default testStep