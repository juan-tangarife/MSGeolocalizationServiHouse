const express = require("express");
const router = express.Router();
const { getDeliveryLocation, updateDeliveryLocation } = require("../controllers/mapDeliveries.controller.js");

router.get("/getDeliveryLocation/:id", getDeliveryLocation);
router.put("/updateDeliveryLocation", updateDeliveryLocation);

module.exports = router;