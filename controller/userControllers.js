import catchAsync from "../utils/catchAsync.js";
import User from "../models/userSchema.js";
import createSendToken from "./authController.js";


// Function to create a new user
export const signup = catchAsync(async (req, res) => {

  const emailTaken = await User.findOne({ email: req.body.email?.toString() });

  if (emailTaken) return res.status(400).send({ error: "Email Taken" });

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  await createSendToken(user.toObject(), 200, res);

  });

export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  return res.json({
    success: true,
    data: users,
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await User.getUserByIdWithRoles(req.params.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.json({
    success: true,
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await User.updateUserById(req.params.userId, req.body);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.json({
    success: true,
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
export default { signup, getUsers, getUser, updateUser, deleteUser };
