const express = require("express");
const router = express.Router();
const mapOrdersRoutes = require("./maporders.routes.js");
const mapDeliveriesRoutes = require("./mapdeliveries.routes.js");

router.use('/maporders', mapOrdersRoutes);
router.use('/mapdeliveries', mapDeliveriesRoutes);


module.exports = router;