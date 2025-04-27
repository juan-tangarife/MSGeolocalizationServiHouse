const express = require("express");
const router = express.Router();
const {testMaps} = require("../controllers/mapsController.js")
router.get('/', testMaps);

module.exports = router;