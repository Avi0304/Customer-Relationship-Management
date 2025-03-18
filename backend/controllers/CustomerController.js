const Customer = require('../models/Customer')



const getAllCustomer = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error getting customer", error });
    }
}

const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, segmentation, status, leadstatus, amount } = req.body

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer is alerady Exists' });
        }

        const newCustomer = new Customer({
            name,
            email,
            phone,
            segmentation,
            status: status || "pending",
            leadstatus: leadstatus || "new",
            amount
        })

        await newCustomer.save();
        res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: "Error creating customer", error });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const updatedcustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedcustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer Upated Successfully...', customer: updatedcustomer });
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const deletecustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletecustomer) {
            return res.status(404).json({ message: 'Customer is not found' });
        }
        res.status(200).json({message: 'Customer is deleted successfully...'});
    } catch (error) {
        res.status(500).json({ message: 'Error in Deleting the Customer' });
    }
}


const customerSegmentation = async(req,res) => {
    try {
        const totalCustomers = await Customer.countDocuments();

        if(totalCustomers === 0){
            return res.status(200).json({ message: "No customer data available", data: [] });
        }

        const highValueCustomer = await Customer.countDocuments({segmentation: 'High'});
        const MediumValueCustomer = await Customer.countDocuments({segmentation: 'Medium'});
        const LowValueCustomer = await Customer.countDocuments({segmentation: 'Low'});

        const highPercentage = ((highValueCustomer/totalCustomers) * 100).toFixed(1);
        const MediumPercentage = ((MediumValueCustomer/totalCustomers) * 100).toFixed(1);
        const LowPercentage = ((LowValueCustomer/totalCustomers) * 100).toFixed(1);

        const segmentationData = [
            { label: "High-Value", percentage: highPercentage, color: "#008000" }, 
            { label: "Medium-Value", percentage: MediumPercentage, color: "#DAA520" },
            { label: "Low-Value", percentage: LowPercentage, color: "#DC143C" } 
        ];

        res.status(200).json({message: 'Customer Segmentation Data: ', data: segmentationData})

    } catch (error) {
        res.status(500).json({message: 'Error in customer segemenatation...', error});
    }
}

module.exports = { getAllCustomer, addCustomer, updateCustomer, deleteCustomer,customerSegmentation }