import Agenda from "agenda";
import catchAsync from "./utils/catchAsync.js";
import nodemailer from "nodemailer";
import User from "./models/userSchema.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

// Validate environment variables
if (!process.env.DB_CONNECTION || !process.env.DB_COLLECTION) {
  console.error("Agenda DB connection details are not set");
  process.exit(1);
}

// Initialize Agenda
const agenda = new Agenda({
  db: {
    address: process.env.DB_CONNECTION,
    collection: process.env.DB_COLLECTION,
  },
});

// Start Agenda
const initAgenda = async () => {
  try {
    await agenda.start();
    console.log("Agenda initialized and scheduler started");
  } catch (error) {
    console.error("Error starting Agenda:", error);
  }
};
initAgenda();

// Define the sendEmail job
const sendEmailJob = "sendEmail";

agenda.define(sendEmailJob, async (job) => {
  console.log("Starting email job:", job.attrs._id);
  console.log("Job data:", job.attrs.data);

  try {
    const { userEmail, subject, text } = job.attrs.data;

    console.log(
      `Attempting to send email to ${userEmail} with subject: ${subject}`
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log("Transporter created, attempting to send email...");

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject,
      text,
    });

    console.log(`Email sent successfully: ${result.messageId}`);
    console.log("Email details:", {
      to: userEmail,
      subject,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Error in email job:", error);
    console.error("Job details:", {
      id: job.attrs._id,
      data: job.attrs.data,
      error: error.message,
    });
    throw error; // Re-throw to let Agenda know the job failed
  }
});

// Format date with timezone
const formatDate = (date, timezone) => {
  try {
    return new Date(date).toLocaleString("en-US", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "short",
    });
  } catch (error) {
    console.error("Invalid timezone provided:", timezone);
    return date;
  }
};

export const scheduleEventReminder = catchAsync(async function (req, res) {
  const { endDate, title, description, startDate, timeZone } = req.body;

  console.log("Received request with data:", {
    endDate,
    title,
    startDate,
    timeZone,
  });

  // 1. Validate user and email
  const user = await User.findById(req.user?._id);
  if (!user || !user.email) {
    console.log("User or email not found for user ID:", req.user?._id);
    return res.status(400).json({
      status: false,
      message: "User email not found. Cannot schedule a reminder.",
    });
  }

  console.log("Found user with email:", user.email);

  // 2. Validate the event date
  const reminderDate = new Date(endDate);
  if (isNaN(reminderDate)) {
    console.log("Invalid date provided:", endDate);
    return res.status(400).json({
      status: false,
      message: "Invalid endDate provided.",
    });
  }

  console.log("Validated date:", reminderDate);

  // email content
  const subject = `Reminder: ${title}`;
  const text = `
    Hello ${user.name || "User"},
    
    This is a reminder about your event:
    
    Event Details:
    - Title: ${title}
    - Description: ${description || "No description provided."}
    - Start Time: ${formatDate(startDate, timeZone)}
    - End Time: ${formatDate(endDate, timeZone)}
    
    Thank you for using our service!
  `;

  try {
    console.log("Attempting to schedule email for:", endDate);
    // Schedule the email to be sent at the event time
    const job = await agenda.schedule(endDate, sendEmailJob, {
      userEmail: user.email,
      subject,
      text,
    });

    console.log("Email scheduled successfully. Job ID:", job.attrs._id);

    return res.status(200).json({
      status: true,
      message: "Event reminder scheduled successfully",
      scheduledTime: endDate,
      jobId: job.attrs._id,
    });
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to schedule reminder",
      error: error.message,
    });
  }
});
