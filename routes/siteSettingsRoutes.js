import { Router } from "express";

// internal imports
import {
  updateSiteSettings,
  getSiteSettings,
  createSiteSettings,
  deleteSiteSettings,
} from "../controller/siteSettingsController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { restrictTo } from "../middleware/restrictTo.js";

const router = Router();

// router
router.get("/", checkAuth, getSiteSettings);
router.post("/", checkAuth, restrictTo("admin"), createSiteSettings);
router.patch("/:ssid", checkAuth, restrictTo("admin"), updateSiteSettings);
router.delete("/:ssid", checkAuth, restrictTo("admin"), deleteSiteSettings);

// export
export const siteSettingsRoutes = router;
