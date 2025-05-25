const express = require("express");
const router = express.Router();
const mapOrdersRoutes = require("./maporders.routes.js");

router.use('/maporders', mapOrdersRoutes);

module.exports = router;