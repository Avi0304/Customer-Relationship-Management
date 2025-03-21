const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
require("dotenv").config();
const moment = require("moment");





const getprofile = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId).select("-password -resettoken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the correct field is used for DOB
        const formattedUser = {
            ...user.toObject(),
            dob: user.DOB ? moment(user.DOB).format("DD-MM-YYYY") : null, // Format DOB correctly
        };

        res.status(200).json(formattedUser);
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateProfile = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        let { name, bio, DOB } = req.body;

        if (!name && !bio && !DOB) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        if (DOB) {
            if (!dayjs(DOB, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).json({ message: "Invalid DOB format. Use YYYY-MM-DD." });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, bio, DOB },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...updatedUser.toObject(),
                DOB: updatedUser.DOB ? dayjs(updatedUser.DOB).format('DD/MM/YYYY') : null
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


const updateContact = async(req,res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const {email, phone, address} = req.body;

        if(!email && !phone && !address){
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const updateContact = await User.findByIdAndUpdate(
            userId,
            {email,phone,address},
            {new: true, runValidators: true}
        )

        if (!updateContact) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updateContact);
       
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
}

const updateProfessional = async(req,res) =>{
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No Token Provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const {organization, skills, occupation} = req.body

        if(!organization && !skills && !occupation){
            return res.status(400).json({message: 'All field are not filled'});
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {organization, skills, occupation},
            {new: true, runValidators: true}
        )

        if(!updateUser){
            return res.status(404).json({message: "User not found for Update"});
        }

        res.status(200).json(updateUser);

    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = { getprofile, updateProfile, updateContact, updateProfessional }