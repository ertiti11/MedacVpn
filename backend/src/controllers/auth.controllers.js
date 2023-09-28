import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: passwordHash });
    const newUserSaved = await newUser.save();
    jwt.sign(
      { id: newUserSaved._id },
      "secret123",
      { expiresIn: "1d" },

      (err, token) => {
        if (err) {
          console.log(err);
        } else {
          res.json({ token });
        }
      }
    );
    // res.json({
    //   id: newUserSaved._id,
    //   username: newUserSaved.username,
    //   email: newUserSaved.email,
    //   createdAt: newUserSaved.createdAt,
    //   updatedAt: newUserSaved.updatedAt,
    // });
  } catch (error) {
    res.json("Error: " + error);
  }
};
export const login = (req, res) => {
  res.send("login");
};
