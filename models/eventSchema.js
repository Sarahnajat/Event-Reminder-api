import mongoose from "mongoose";
import slugify from "slugify";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: " " },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "canceled"],
      default: "pending",
    },
    timeZone: { type: String, default: "UTC" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String },
  },
  { strict: false },
);

//document middlawre
eventSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

const EventSchedule = mongoose.model("EventSchedule", eventSchema, "events");
export default EventSchedule;
