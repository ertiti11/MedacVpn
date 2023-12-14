const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const { createAccessToken } = require("../libs/jwt.js");
const { success } = require("../libs/utils.js");

// const CheckUser = async (req) => {
//   console.log(req.body);
//   const userFound = await User.findById(req.user.id);
//   if (!userFound) return res.status(400).json({ message: "user not found" });
//   console.log("yeeeeeeeeees");

//   return userFound;
// };

const register = async (req, res) => {
  const { username, email, password } = req.body;
  success(req.body);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });

    //comprobe if user exist
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUserSaved = await newUser.save();

    const token = await createAccessToken({ id: newUserSaved._id });

    res.cookie("token", token);
    res.status(201);
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) return res.status(400).json({ message: "user not found" });
    console.log(userFound);
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

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "user not found" });
  res.status(200);
  res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);

  res.json({
    message: "user deleted",
  });
};

// TODO: update user
const updateUser = async (req, res) => {
  const filter = { id: req.user.id };
  success(filter.id);
  const update = { age: 59 };

  const userFound = await User.findById(req.user.id);
  if (!userFound) return res.status(400).json({ message: "user not found" });
  res.send("update user");
};

module.exports = { register, login, logout, profile, deleteUser, updateUser };
