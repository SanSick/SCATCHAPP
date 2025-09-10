const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router = express.Router();

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error: error, loggedin: false });
});

router.get("/index", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error: error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
  try {
    let products = await productModel.find(); //* we are not putting any aggregater as their is only one seller.
    let success = req.flash("success");
    res.render("shop", { products, success });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).send("Server error");
  }
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  // console.log(user.cart);
  res.render("cart", { user });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error");
  }
});

router.get("/logout", isLoggedIn, function (req, res) {
  res.redirect("/index");
});

module.exports = router;
