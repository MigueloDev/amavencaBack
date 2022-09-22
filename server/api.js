
const express = require("express");

const router = express.Router();

const { getTasa, getProduct } = require('./controllers/controller')

router.get("/getTasa", getTasa)

router.post("/getProducto", getProduct)

module.exports = router