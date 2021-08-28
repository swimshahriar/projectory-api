// internal imports
import catchAsync from "../utils/catchAsync.js";
import { SiteSettings } from "../model/siteSettingsModel.js";

// ------------------ get site settings -------------------
export const getSiteSettings = catchAsync(async (req, res, next) => {
  const settings = await SiteSettings.find();

  return res.status(200).json({
    status: "success",
    settings,
  });
});

// ----------------- create site settings -----------------
export const createSiteSettings = catchAsync(async (req, res, next) => {
  const settings = new SiteSettings({
    ...req.body,
  });
  await settings.save();

  return res.status(200).json({
    status: "success",
    settings: [settings],
  });
});

// ----------------- update site settings -------------------
export const updateSiteSettings = catchAsync(async (req, res, next) => {
  const { ssid } = req.params;

  const settings = await SiteSettings.findByIdAndUpdate(
    { _id: ssid },
    { ...req.body },
    { new: true }
  );

  return res.status(200).json({
    status: "success",
    settings: [settings],
  });
});

// ----------------- delete site settings -------------------
export const deleteSiteSettings = catchAsync(async (req, res, next) => {
  const { ssid } = req.params;

  await SiteSettings.findByIdAndDelete({ _id: ssid });

  return res.status(200).json({
    status: "success",
  });
});
