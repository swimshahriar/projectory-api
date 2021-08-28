import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    bdtToUsd: {
      type: Number,
      default: 82,
    },
    commission: {
      type: Number,
      default: 15,
    },
  },
  { timestamps: true }
);

// export
export const SiteSettings = mongoose.model("SiteSetting", siteSettingsSchema);
