const Lead = require("../models/Leads"); // Ensure correct import
const Customer = require("../models/Customer");

// Create a new lead and link it to a customer
exports.createLead = async (req, res) => {
  try {
    const { name, contactInfo, status, customerId } = req.body;

    if (
      !contactInfo ||
      typeof contactInfo !== "object" ||
      !contactInfo.email ||
      !contactInfo.phone
    ) {
      return res
        .status(400)
        .json({ message: "Invalid contactInfo format. It should contain email and phone." });
    }

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

exports.updateLead = async (req, res) => {
  try {
    const { status } = req.body;

    // Ensure status is lowercase
    const validStatuses = ["new", "contacted", "converted"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid lead status value." });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status.toLowerCase();
    await lead.save();

    let updatedCustomer = null; // Variable to store updated customer data

    // If lead is converted, update customer status to "completed" and store lead details
    if (lead.customerId) {
      const updateData = { leadstatus: lead.status };

      if (status.toLowerCase() === "converted") {
        updateData.status = "completed"; // Ensure only valid values are used
        updateData.leadId = lead._id; // Store lead reference
      }

      updatedCustomer = await Customer.findByIdAndUpdate(
        lead.customerId,
        updateData,
        { new: true } // Returns the updated document
      );
    }

    res.status(200).json({
      message: "Lead updated and synced with customer",
      lead,
      customerId: lead.customerId, // Send customerId in response
      updatedCustomer, // Include updated customer details
    });
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
