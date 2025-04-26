import express from "express";
import { resetPassword,forgotPassword, login, updatePassword, authenticateUser } from "../controller/authController.js";
import { scheduleEventReminder } from "../schedule.js";
const userRouter = express.Router();
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser, signup }
    from "../controller/userControllers.js";

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.route("/:id").get(getUser).delete(deleteUser);
userRouter.route("/").get(getUsers);
userRouter.post("/events",authenticateUser, scheduleEventReminder);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);
userRouter.patch('/updateMyPassword', authenticateUser, updatePassword);
//update user information
userRouter.patch('/update', authenticateUser, updateUser);

export default userRouter;
