import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });
    const newUserSaved = await newUser.save();

    const token = await createAccessToken({ id: newUserSaved._id });

    res.cookie("token", token);

    res.json({
      id: newUserSaved._id,
      username: newUserSaved.username,
      email: newUserSaved.email,
      createdAt: newUserSaved.createdAt,
      updatedAt: newUserSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "user not found" });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "incorrect password" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json("Error: " + error.message);
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "user not found" });

  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};



export const deleteUser = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "user not found" });

  await User.findByIdAndDelete(req.user.id)

  res.json({
    message: "user deleted"
  })


}