const mongoose = require("mongoose");
const fetch = require("node-fetch"); // v2 for CJS compatibility
const Product = require("./models/product-model");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/myshop")
  .then(() => {
    console.log("✅ MongoDB connected");

    // Fetch products from DummyJSON API
    return fetch("https://dummyjson.com/products?limit=50&skip=0&select=title,price,description,category,thumbnail");
  })
  .then(res => res.json())
  .then(data => {
    const products = data.products.map(p => ({
      name: p.title,
      price: p.price,
      category: p.category || "General",
      description: p.description || "No description available",
      image: p.thumbnail || "https://via.placeholder.com/150"
    }));

    // Clear old products
    return Product.deleteMany().then(() => Product.insertMany(products));
  })
  .then(products => {
    console.log(`🌱 Seeded ${products.length} products successfully!`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("❌ Error:", err);
    mongoose.connection.close();
  });
