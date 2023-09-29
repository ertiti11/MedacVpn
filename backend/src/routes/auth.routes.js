import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  deleteUser,updateUser
} from "../controllers/auth.controllers.js";
import { authRequired } from "../middlewares/validateToken.js";
import { createKey } from "../controllers/key.controllers.js";
const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", authRequired, profile);

router.get("/keys", authRequired, createKey);

router.post("/delete", authRequired, deleteUser)

router.post("/update", authRequired, updateUser)


export default router;
