const express = require("express");
const {
  getAllCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  customerSegmentation,
  getCustomerById,
} = require("../controllers/CustomerController");

const router = express.Router();

router.get("/all", getAllCustomer);
router.get("/get/:id", getCustomerById);
router.post("/add", addCustomer);
router.put("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);
router.get("/segmentation", customerSegmentation);

module.exports = router;
