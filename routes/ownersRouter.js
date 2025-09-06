const express = require("express");
const router = express.Router();

router.get("/ownerlogin", function(req, res){
    res.render("owner-login");
});


module.exports = router;