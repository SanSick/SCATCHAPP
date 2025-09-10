const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");

router.get("/", function (req, res) {
  res.send("Hey productsRouter is working");
});

// router.get("/create", function (req, res) {
//   let success = req.flash("success");
//   res.render("createproducts", {success});
// });
router.post("/create", upload.single("image"), async function (req, res) {
  try {
    let { name, price, category, description } = req.body;

    let base64Image = req.file.buffer.toString("base64");
    let mimeType = req.file.mimetype; // e.g. "image/png" or "image/jpeg"

    let product = await productModel.create({
      image:  `data:${mimeType};base64,${base64Image}`,
      name,
      price,
      category,
      description,
    });

    req.flash("success", "Product created successfully.");
    res.redirect("/owners/admin");
  } catch (err) {
    console.error("❌ Error creating a product:", err);
    res.status(500).send("Server error");
  }
});

router.get("/:productid", isLoggedIn, async function (req, res) {
  let product = await productModel.findOne({ _id: req.params.productid });
  res.render("viewproduct", { product });
});

module.exports = router;
