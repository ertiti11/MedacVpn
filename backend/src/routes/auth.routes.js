const Router = require("express");
const { register, login, logout, profile, deleteUser, updateUser } = require("../controllers/auth.controllers.js");
const { authRequired } = require("../middlewares/validateToken.js");
const { createKey } = require("../controllers/key.controllers.js");


const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", authRequired, profile);

router.get("/keys", authRequired, createKey);

router.post("/delete", authRequired, deleteUser)

router.post("/update", authRequired, updateUser)


module.exports = router;