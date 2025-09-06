const express = require("express");
const app = express();
const path = require("path");

const indexRouter = require("./routes/index");
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);

app.listen("3000", (error) =>
  console.log(
    error
      ? `Error starting server: ${error.message}`
      : "Server is running on port 3000"
  )
);
