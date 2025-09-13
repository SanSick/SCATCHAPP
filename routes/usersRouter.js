const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
} = require("../controllers/authController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require("../models/user-model");

const multer = require("multer");

// Configure Multer to store uploads in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage: storage });

router.get("/", function (req, res) {
  res.send("Hey usersRouter is working");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/account", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  // console.log(user);

  res.render("userprofile", { user });
});

const bcrypt = require("bcrypt");

router.post(
  "/account/update",
  isLoggedIn,
  upload.single("picture"),
  async function (req, res) {
    try {
      let user = await userModel.findOne({ email: req.user.email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      user.fullname = req.body.fullname || user.fullname;
      user.email = req.body.email || user.email;
      user.contact = req.body.contact || user.contact;
      user.address = req.body.address || user.address;

      if (req.file) {
        user.picture = "/uploads/" + req.file.filename;
      }

      if (
        req.body.currentPassword &&
        req.body.newPassword &&
        req.body.confirmPassword
      ) {
        // 1. Verify current password
        const isMatch = await bcrypt.compare(
          req.body.currentPassword,
          user.password
        );
        if (!isMatch) {
          return res.status(400).send("Current password is incorrect");
        }

        // 2. Check new password matches confirmation
        if (req.body.newPassword !== req.body.confirmPassword) {
          return res
            .status(400)
            .send("New password and confirmation do not match");
        }

        // 3. Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
      }

      await user.save();
      res.redirect("/users/account");
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).send("Something went wrong");
    }
  }
);

router.get("/logout", isLoggedIn, logout);

module.exports = router;
