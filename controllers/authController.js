const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(401).send("You already have account, please login");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          // res.send(hash);
          let user = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          // res.send(user);
          let token = generateToken(user);
          //   res.send(token);
          res.cookie("token", token);
          res.send("User created successfully");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) {
    req.flash("error", "Email or Password incorrect");
    return res.redirect("/index");
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/index");
    }
  });
};

module.exports.logout = function(req, res){
  res.cookie("token", "");
  res.redirect("/index");
}