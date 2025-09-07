const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

require("dotenv").config();

const indexRouter = require("./routes/index");
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const usersRouter = require("./routes/usersRouter");

const db = require("./config/mongoose-connection");

// session middleware (must be before routes)
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET, 
  })
);

// Initialize connect-flash middleware // flash middleware
app.use(flash());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);

// if (process.env.NODE_ENV === 'development') {
//     console.log("⚙️ App running in DEVELOPMENT mode");
// }

app.listen("3000", (error) =>
  console.log(
    error
      ? `Error starting server: ${error.message}`
      : "Server is running on port 3000"
  )
);
