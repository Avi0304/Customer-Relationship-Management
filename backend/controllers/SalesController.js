const Sale = require("../models/Sales");
const { createNotification } = require('../utils/notificationService');

// Update notification helper function
const notifySaleAdded = async (sale) => {
  await createNotification({
    title: 'New Sale Added',
    message: `New sale added: ${sale.customer} - $${sale.amount}`,
    type: 'sale',
    userId: sale.userId,
  });
};

// Update status change notification
const notifySaleStatusUpdated = async (sale, previousStatus, newStatus) => {
  await createNotification({
    title: 'Sale Status Updated',
    message: `Sale status updated from ${previousStatus} to ${newStatus}`,
    type: 'sale',
    userId: sale.userId,
  });
};

// ➤ Get All Sales
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sales", error });
  }
};

// ➤ Add Sale
const addSale = async (req, res) => {
  try {
    const { customer, amount, status } = req.body;

    const newSale = new Sale({
      customer,
      amount,
      status: status || "Pending",
    });

    const savedSale = await newSale.save();
    await notifySaleAdded(savedSale);
    res.status(201).json({ message: "Sale added successfully", sale: savedSale });
  } catch (error) {
    res.status(500).json({ message: "Error adding sale", error });
  }
};

// ➤ Update Sale
const updateSale = async (req, res) => {
  try {
    const existingSale = await Sale.findById(req.params.id);
    if (!existingSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const previousStatus = existingSale.status;
    const newStatus = req.body.status;

    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (newStatus && previousStatus !== newStatus) {
      await notifySaleStatusUpdated(updatedSale, previousStatus, newStatus);
    }

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res
      .status(200)
      .json({ message: "Sale updated successfully", sale: updatedSale });
  } catch (error) {
    res.status(500).json({ message: "Error updating sale", error });
  }
};

// ➤ Delete Sale
const deleteSale = async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sale", error });
  }
};

// ➤ Sales Segmentation
const salesSegmentation = async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();

    if (totalSales === 0) {
      return res
        .status(200)
        .json({ message: "No sales data available", data: [] });
    }

    const completedSales = await Sale.countDocuments({ status: "Completed" });
    const pendingSales = await Sale.countDocuments({ status: "Pending" });
    const cancelledSales = await Sale.countDocuments({ status: "Cancelled" });

    const completedPercentage = ((completedSales / totalSales) * 100).toFixed(
      1
    );
    const pendingPercentage = ((pendingSales / totalSales) * 100).toFixed(1);
    const cancelledPercentage = ((cancelledSales / totalSales) * 100).toFixed(
      1
    );

    const segmentationData = [
      { label: "Completed", percentage: completedPercentage, color: "#008000" },
      { label: "Pending", percentage: pendingPercentage, color: "#DAA520" },
      { label: "Cancelled", percentage: cancelledPercentage, color: "#DC143C" },
    ];

    res
      .status(200)
      .json({ message: "Sales Segmentation Data", data: segmentationData });
  } catch (error) {
    res.status(500).json({ message: "Error in sales segmentation", error });
  }
};

module.exports = {
  getAllSales,
  addSale,
  updateSale,
  deleteSale,
  salesSegmentation,
};
