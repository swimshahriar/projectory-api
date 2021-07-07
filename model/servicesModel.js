import mongoose from "mongoose";
import validator from "validator";

const servicesSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title required."] },
});

// export
export const Services = mongoose.model("Service", servicesSchema);
