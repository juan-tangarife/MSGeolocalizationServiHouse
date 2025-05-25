const express = require("express");
const router = express.Router();
const { asignOrderToDelivery } = require("../controllers/mapOrders.controller.js");

router.post("/asignOrderToDelivery", asignOrderToDelivery);

module.exports = router;