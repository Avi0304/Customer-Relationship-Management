const express = require("express");
const {
  getAllSales,
  addSale,
  updateSale,
  deleteSale,
  salesSegmentation,
} = require("../controllers/SalesController");

const router = express.Router();

router.get("/all", getAllSales);
router.post("/add", addSale);
router.put("/update/:id", updateSale);
router.delete("/delete/:id", deleteSale);
router.get("/segmentation", salesSegmentation);

module.exports = router;
