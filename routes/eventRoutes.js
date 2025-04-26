import express from "express";
import { authenticateUser } from "../controller/authController.js";
import {
  getEvent,
  getEvents,
  postEvent,
  updateEvent,
  deleteEvent,
} from "../controller/eventController.js";
const router = express.Router();

router
  .route("/")
  .get(authenticateUser,getEvents)
  .post(authenticateUser, postEvent);
router
  .route("/:id")
  .get( authenticateUser, getEvent)
  .put(authenticateUser, updateEvent)
  .delete(authenticateUser, deleteEvent);

export default router;
