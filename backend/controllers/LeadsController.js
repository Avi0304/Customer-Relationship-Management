const Lead = require("../models/Leads");
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
      return res.status(400).json({
        message:
          "Invalid contactInfo format. It should contain email and phone.",
      });
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
    const { name, contactInfo, status } = req.body;
    const { id } = req.params;

    const validStatuses = ["new", "contacted", "converted"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid lead status value." });
    }

    let lead = await Lead.findById(id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Update lead status
    lead.status = status.toLowerCase();
    await lead.save();

    let updatedCustomer = null; // Store customer details if created/updated

    if (status.toLowerCase() === "converted") {
      if (!lead.customerId) {
        // If lead is converted but doesn't have a linked customer, create a new customer
        const newCustomer = new Customer({
          name: lead.name,
          email: lead.contactInfo.email,
          phone: lead.contactInfo.phone,
          amount: "0", // Default amount, update as needed
          segmentation: "Medium", // Default segmentation, update as needed
          status: "pending",
          leadstatus: "converted",
          leadId: lead._id,
        });

        await newCustomer.save();

        // Update the lead to store reference to the new customer
        lead.customerId = newCustomer._id;
        await lead.save();

        updatedCustomer = newCustomer;
      } else {
        // If customer exists, update its status
        updatedCustomer = await Customer.findByIdAndUpdate(
          lead.customerId,
          { leadstatus: "converted", status: "completed" },
          { new: true }
        );
      }
    }

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
      customer: updatedCustomer, // Send the customer details in response
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
