const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
require("dotenv").config();

// login 
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, verified: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found or verfied' });
        }

        const iPasswordValid = await bcrypt.compare(password, user.password);
        if (!iPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with same email already exists' })
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpassword,
            verified: true,
        })
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ token, userId: newUser._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const forgetpassword = async (req, res) => {
    try {
      const email = req.body.email.toLowerCase();
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Email is not found" });
      }
  
      // Generate Reset Token
      const resettoken = Math.random().toString(36).substring(2, 8);
  
      // ✅ Use findByIdAndUpdate to ensure it's saved in DB
      await User.findByIdAndUpdate(user._id, { resettoken }, { new: true });
  
      console.log("Generated Token:", resettoken); // Debugging log
  
      // Send Email with Reset Token
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `Hello, use this code to reset your password: ${resettoken}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.json({ message: "Reset password email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  

const resetpassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        console.log("Reset Password Request Received:");
        console.log("Email:", email);
        console.log("Token:", token);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found in the database.");
            return res.status(400).json({ message: "Email not found" });
        }

        console.log("✅ User found:", user);

        if (user.resettoken !== token) {
            console.log("❌ Reset token does not match.");
            return res.status(400).json({ message: "Reset token is invalid or expired" });
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        user.resettoken = null;
        await user.save();

        console.log("✅ Password updated successfully.");
        res.json({ message: "Password has been reset successfully!" });

    } catch (error) {
        console.error("❌ Error resetting password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = { loginController, registerController, forgetpassword, resetpassword };