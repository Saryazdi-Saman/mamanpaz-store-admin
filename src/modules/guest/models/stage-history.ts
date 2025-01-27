import { model } from "@medusajs/framework/utils";
import { OnboardingStage } from "../types";
import { Guest } from "./guest";

export const StageHistory = model.define("stage_history", {
    id: model.id().primaryKey(),
    stage: model.enum(OnboardingStage).default(OnboardingStage.INITIAL),
    completed_at: model.dateTime().nullable(),
    guest: model.belongsTo(() => Guest, {
        mappedBy: "process_history",
    })
});