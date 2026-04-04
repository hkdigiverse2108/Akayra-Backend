import { CronJob } from "cron";
import { bannerModel } from "../database";

export const deactivateExpiredBanners = async () => {
  try {
    const now = new Date();

    await bannerModel.updateMany({ isDeleted: false, isActive: true, endDate: { $lte: now } }, { $set: { isActive: false } });

    console.log(`[CRON] Expired banners deactivated at ${now.toISOString()}`);
  } catch (error) {
    console.error("[CRON] Error deactivating expired banners:", error);
  }
};

export const initCronJobs = () => {
  const bannerExpiryCron = new CronJob("0 0 * * *", deactivateExpiredBanners);
  bannerExpiryCron.start();
  console.log("[CRON] Banner expiry cron job initialized (runs every 1 hour)");
};
