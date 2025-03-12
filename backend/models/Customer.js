const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: String,
        require: true
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
},{ timeStamp: true })

const Customer = mongoose.model('Customer',CustomerSchema);
module.exports = Customer; 
