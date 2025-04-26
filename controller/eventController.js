import ApiFeatures from "../utils/apiFeatures.js";
import EventSchedule from "../models/eventSchema.js";
import catchAsync from "../utils/catchAsync.js";
import { scheduleEventReminder } from "../schedule.js";

//@desc Get DB_CONNECTION events
// @ routes get/api/v1/events
//@access public
export const getEvents = catchAsync(async (req, res, next) => {
  const queryObject = {};

  const event = EventSchedule.find(queryObject);
  //excute the query
  const features = new ApiFeatures(event, req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  // Execute the query
  const events = await features.query.exec();
  res.status(200).json({ success: true, count: events.length, data: events });
});

//@desc Get one event
// @ routes get/api/v1/events
//@access public
export const getEvent = catchAsync(async (req, res, next) => {
  const targetEvent = await EventSchedule.findById(req.params.id);
  if (!targetEvent) return res.status(404).json({ message: "Event not found" });
  res.status(200).json({ success: true, data: targetEvent });
});

//@desc add events
// @ routes get/api/v1/events
//@access public
export const postEvent = catchAsync(async (req, res, next) => {
  // 1. Create the event
  req.body.user = req.user._id;
  const newEvent = await EventSchedule.create(req.body);

  // 2. Schedule the reminder email
  try {
    await scheduleEventReminder(req, res);
  } catch (error) {
    console.error("Failed to schedule reminder email:", error);
    // We still return success since the event was created
    return res.status(200).json({
      success: true,
      data: newEvent,
      reminderStatus: "Failed to schedule reminder email",
    });
  }

  res.status(200).json({
    success: true,
    data: newEvent,
    reminderStatus: "Reminder email scheduled successfully",
  });
});

//@desc update  events
// @ routes get/api/v1/events
//@access private
export const updateEvent = catchAsync(async (req, res) => {
  const updatedEvent = await EventSchedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedEvent) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  res.status(200).json({ success: true, data: updatedEvent });
});
//@desc delete events
// @ routes get/api/v1/events
//@access private
export const deleteEvent = catchAsync(async (req, res) => {
  const deletedEvent = await EventSchedule.findByIdAndDelete(req.params.id);
  if (!deletedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.status(200).json({ message: "Data deleted successfully" });
});
