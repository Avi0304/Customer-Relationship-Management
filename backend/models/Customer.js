const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    segmentation: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    },
    status: { 
        type: String, 
        enum: ["pending", "completed", "cancelled"], 
        default: "pending" 
    },
    leadstatus: {
        type: String, 
        enum: ["new", "converted", "contacted"], 
        default: "new" 
    },
},{ timestamps: true })

const Customer = mongoose.model('Customer',CustomerSchema);
module.exports = Customer; 
