import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

const getSalesChannelsStep = createStep(
    "get-sales-channels",
    async ({ }, { container }) => {
        const storeService = container.resolve(Modules.SALES_CHANNEL)
        const salesChannels = await storeService.listSalesChannels({}, {
            select: ['id']
        })
        const sales_channels_ids = salesChannels.map((channel) => {
            return {
                id: channel.id
            }
        })
        
        return new StepResponse({
            sales_channels_ids
        })
    }
)

export default getSalesChannelsStep