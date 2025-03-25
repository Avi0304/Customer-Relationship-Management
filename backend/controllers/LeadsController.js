const Lead = require("../models/Leads"); // Ensure correct import
const Customer = require("../models/Customer");

// Create a new lead and link it to a customer
exports.createLead = async (req, res) => {
  try {
    const { name, contactInfo, status, customerId } = req.body;

    let newLead;

    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      newLead = new Lead({ name, contactInfo, status, customerId });
      await newLead.save();

      // Update customer only if customerId is provided
      await Customer.findByIdAndUpdate(customerId, {
        leadstatus: status,
        leadId: newLead._id,
      });
    } else {
      newLead = new Lead({ name, contactInfo, status });
      await newLead.save();
    }

    res.status(201).json({ message: "Lead created successfully", newLead });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Error creating lead", error });
  }
};

// Get all leads with customer details
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate(
      "customerId",
      "name email phone leadstatus"
    );
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Error fetching leads", error });
  }
};

// Get a single lead by ID with customer details
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "customerId",
      "name email phone leadstatus"
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.status(200).json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ message: "Error fetching lead", error });
  }
};

// Update lead status and sync with customer
exports.updateLead = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status;
    await lead.save();

    if (lead.customerId) {
      await Customer.findByIdAndUpdate(lead.customerId, { leadstatus: status });
    }

    res
      .status(200)
      .json({ message: "Lead updated and synced with customer", lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Error updating lead", error });
  }
};

// Delete lead and remove reference from customer
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    if (lead.customerId) {
      await Customer.findByIdAndUpdate(lead.customerId, {
        leadstatus: "new",
        leadId: null,
      });
    }

    await lead.deleteOne();
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Error deleting lead", error });
  }
};
