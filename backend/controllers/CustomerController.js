const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Lead = require("../models/Leads"); 
const Sale = require("../models/Sales");

const { createNotification } = require('../utils/notificationService');

// Helper function for lead status change notifications
const maybeSendLeadStatusChangeNotification = async (leadId, previousStatus, newStatus) => {
  if (previousStatus !== newStatus) {
    await createNotification({
      title: 'Lead Status Updated',
      message: `Lead status changed from "${previousStatus}" to "${newStatus}"`,
      type: 'status'
    });
  }
};
// Get all customers
const getAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error getting customers:", error);
    res.status(500).json({ message: "Error getting customers", error });
  }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer", error });
  }
};

// Add a new customer
const addCustomer = async (req, res) => {
  try {
    const { name, email, phone, status, leadstatus, amount, services } =
      req.body;

    // First, check if a customer with the same email exists
    const existingEmailCustomer = await Customer.findOne({ email });
    if (existingEmailCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this email already exists" });
    }

    // Check if a customer with the same phone number exists
    const existingPhoneCustomer = await Customer.findOne({ phone });
    if (existingPhoneCustomer) {
      return res
        .status(400)
        .json({ message: "Customer with this phone number already exists" });
    }

    let segmentation = "Low";
    if(amount >= 20000){
      segmentation = "Medium"
    }
    else if(amount >= 40000){
      segmentation = "High"
    }
    

    // Create and save new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      segmentation,
      status: status || "pending",
      leadstatus: leadstatus || "new",
      amount,
      services
    });

    await newCustomer.save();

    await createNotification({
      title: 'New Customer Added',
      message: `Customer "${name}" has been successfully added.`,
      type: 'customer',
      // userId: newCustomer._id, 
    });


    res
      .status(201)
      .json({ message: "Customer added successfully", customer: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Error creating customer", error });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }


    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (updatedCustomer.status === "completed") {

      const services = updatedCustomer.services || "n/a";

      const newSale = new Sale({
        customer: updatedCustomer.name,       
        customerId: updatedCustomer._id,     
        amount: updatedCustomer.amount,
        status: "Completed",
        services: services
      });
    
      await newSale.save();
    }

    await createNotification({
      title: 'Update Customer Added',
      message: `Customer "${updatedCustomer.name}" has been successfully update.`,
      type: 'customer',
      // userId: newCustomer._id, 
    });


    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer", error });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    // Check if customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Remove associated leads first
    await Lead.deleteMany({ customerId: id });

    // Now delete the customer
    await Customer.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res
      .status(500)
      .json({ message: "Error deleting customer", error: error.message });
  }
};

// Customer Segmentation
const customerSegmentation = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    if (totalCustomers === 0) {
      return res.status(200).json({
        message: "No customer data available",
        data: [
          { label: "High-Value", percentage: "0.0", color: "#008000" },
          { label: "Medium-Value", percentage: "0.0", color: "#DAA520" },
          { label: "Low-Value", percentage: "0.0", color: "#DC143C" },
        ],
      });
    }

    const highValueCount = await Customer.countDocuments({
      segmentation: "High",
    });
    const mediumValueCount = await Customer.countDocuments({
      segmentation: "Medium",
    });
    const lowValueCount = await Customer.countDocuments({
      segmentation: "Low",
    });

    const highPercentage = ((highValueCount / totalCustomers) * 100).toFixed(1);
    const mediumPercentage = (
      (mediumValueCount / totalCustomers) *
      100
    ).toFixed(1);
    const lowPercentage = ((lowValueCount / totalCustomers) * 100).toFixed(1);

    const segmentationData = [
      { label: "High-Value", percentage: highPercentage, color: "#008000" },
      { label: "Medium-Value", percentage: mediumPercentage, color: "#DAA520" },
      { label: "Low-Value", percentage: lowPercentage, color: "#DC143C" },
    ];

    res.status(200).json({
      message: "Customer segmentation data",
      data: segmentationData,
    });
  } catch (error) {
    console.error("Error in customer segmentation:", error);
    res.status(500).json({ message: "Error in customer segmentation", error });
  }
};

// Export functions
module.exports = {
  getAllCustomer,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  customerSegmentation,
};
