const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

const userRoute = require("./routes/user.route.js");
// const merchantRoute = require("./routes/merchant.route");
// const retailRoute = require("./routes/retail.route");
// const adminRoute = require("./routes/admin.route");

router.use("/user", userRoute);
// router.use("/merchant", merchantRoute);
// router.use("/retail", retailRoute);
// router.use("/admin", adminRoute);

module.exports = router;
