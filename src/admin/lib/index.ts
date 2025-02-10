import { CampaignDTO, ProductDTO } from "@medusajs/types"
import { CreateCampaignSchema } from "../validation-schemas";
import { z } from "zod";

export const getCampaigns = async (): Promise<CampaignDTO[] | undefined>  => {
    try {
        const response = await fetch("/admin/shortlink/campaign", {
            method: "GET",
            credentials: "include",
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
        }

        const { data: campaigns } = await response.json()
        return campaigns
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return undefined; 
    }
}

export const createUtmSource = async (data: z.infer<typeof CreateCampaignSchema>) => {
    try {
        const response = await fetch("/admin/shortlink", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`Failed to create campaign: ${response.statusText}`);
        }

        const { message } = await response.json()
        return message
    } catch (error) {
        console.error("Error creating campaign:", error);
        return undefined; 
    }
}
