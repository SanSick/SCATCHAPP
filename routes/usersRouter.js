const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/authController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", function (req, res) {
  res.send("Hey usersRouter is working");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", isLoggedIn ,logout);

module.exports = router;
