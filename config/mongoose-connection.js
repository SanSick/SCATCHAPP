const mongoose = require("mongoose");
const config = require("config");

const dbgr = require("debug")("development:mongoose");

mongoose
  .connect(config.get("MONGODB_URI"))
  .then(function () {
    dbgr("connected");
    console.log("Database connected");
  })
  .catch(function (err) {
    console.log(err);
  });

module.exports = mongoose.connection;

//old code for mongodb compasss
// mongoose
// .connect(`${config.get("MONGODB_URI")}/scatchdb`)
// .then(function () {
//   dbgr("connected");
// })
// .catch(function (err) {
//   console.log(err);
// });

// module.exports = mongoose.connection;
