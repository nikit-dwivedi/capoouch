const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

// const authRoute = require("./routes/auth.route.js");
// const merchantRoute = require("./routes/merchant.route");
// const retailRoute = require("./routes/retail.route");
// const adminRoute = require("./routes/admin.route");

// router.use("/login", authRoute);
// router.use("/merchant", merchantRoute);
// router.use("/retail", retailRoute);
// router.use("/admin", adminRoute);

module.exports = router;
