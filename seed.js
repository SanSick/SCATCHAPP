// const mongooseConnection = require("./config/mongoose-connection");
// const fetch = require("node-fetch"); // make sure you installed node-fetch v2 for require()
// const Product = require("./models/product-model");

// mongooseConnection.once("open", async () => {
//   console.log("✅ DB connected for seeding...");

//   try {
//     // Fetch products from DummyJSON
//     const res = await fetch(
//       "https://dummyjson.com/products?limit=12&skip=0&select=title,price,description,category,thumbnail"
//     );
//     const data = await res.json();
//     // console.log(data);

//     // Transform products to fit your schema
//     const products = data.products.map((p) => ({
//       name: p.title,
//       price: p.price,
//       category: p.category || "General",
//       description: p.description || "No description available",
//       image: p.thumbnail || "https://via.placeholder.com/150",
//     }));

//     // Clear old products and insert new ones
//     await Product.deleteMany();
//     const inserted = await Product.insertMany(products);

//     console.log(`🌱 Seeded ${inserted.length} products successfully!`);
//   } catch (err) {
//     console.error("❌ Error seeding products:", err);
//   } finally {
//     mongooseConnection.close();
//   }
// });

const mongooseConnection = require("./config/mongoose-connection"); 
const fetch = require("node-fetch"); // install node-fetch v2: npm install node-fetch@2
const Product = require("./models/product-model");

mongooseConnection.once("open", async () => {
  console.log("✅ DB connected for seeding...");

  try {
    // Fetch products from DummyJSON
    const res = await fetch(
      "https://dummyjson.com/products?limit=12&skip=0&select=title,price,description,category,thumbnail"
    );
    const data = await res.json();

    // Transform products to fit schema
    const products = data.products.map((p) => ({
      name: p.title,
      price: p.price,
      category: p.category || "General",
      description: p.description || "No description available",
      image: p.thumbnail || "https://via.placeholder.com/150",
    }));

    // Insert products one by one (skip duplicates)
    for (let p of products) {
      const exists = await Product.findOne({ name: p.name, price: p.price });
      if (!exists) {
        await Product.create(p);
        console.log(`✅ Inserted: ${p.name}`);
      } else {
        console.log(`⚠️ Skipped (already exists): ${p.name}`);
      }
    }

    console.log("🌱 Seeding completed!");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  } finally {
    mongooseConnection.close();
  }
});
