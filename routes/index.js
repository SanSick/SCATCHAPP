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
    .populate("cart.product"); 
    

  // console.log(user.cart);
  res.render("cart", { user });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    let existingItem = user.cart.find(
      (item) => item.product.toString() === req.params.productid
    )

    if (existingItem) {
      existingItem.quantity += 1;
    }else{
      user.cart.push({product: req.params.productid, quantity : 1});
    }
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error");
  }
});

router.get("/cart/increasequantity/:productid", isLoggedIn, async function (req, res) {
  try {
    // console.log(req.params.productid)
    let user = await userModel.findOne({ email: req.user.email });
    let prevCart = user.cart;
    // console.log(prevCart)
    const newCart = prevCart.map(c=>
      {
        if(c.product==req.params.productid){
          c.quantity = c.quantity+1;
        }
        return c;
      } 
      )

    user.cart = newCart;

    // console.log(user)

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/cart");
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error");
  }
});

router.get("/cart/decreasequantity/:productid", isLoggedIn, async function (req, res) {
  try {
    // console.log(req.params.productid)
    let user = await userModel.findOne({ email: req.user.email });
    let prevCart = user.cart;
    // console.log(prevCart)
    const newCart = prevCart.map(c=>
      {
        if(c.product==req.params.productid){
          c.quantity = c.quantity-1;
        }
        return c;
      } 
      )

    user.cart = newCart;

    // console.log(user)

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/cart");
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).send("Server error");
  }
});

router.post("/cart/remove/:productid",isLoggedIn, async function(req, res){
  await userModel.findByIdAndUpdate(req.user._id, {
    $pull : { cart: { product: req.params.productid } }
  });
  res.redirect("/cart")
})

router.get("/logout", isLoggedIn, function (req, res) {
  res.redirect("/index");
});

module.exports = router;
