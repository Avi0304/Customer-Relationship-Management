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

       
        const resettoken = Math.random().toString(36).substring(2, 8);

      
        await User.findByIdAndUpdate(user._id, { resettoken }, { new: true });

        console.log("Generated Token:", resettoken); 

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">🔒 Password Reset Request</h2>
                    <p style="color: #555;">
                        Hello, <br><br>
                        We received a request to reset your password. Use the **token below** to proceed with resetting your password:
                    </p>
                    <div style="text-align: center; font-size: 24px; font-weight: bold; color: #2c3e50; padding: 10px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
                        ${resettoken}
                    </div>
                    <p style="color: #555;">
                        If you did not request this, you can safely ignore this email. <br><br>
                        This token is valid for only **15 minutes**.
                    </p>
                    <hr>
                    <p style="color: #555; font-size: 12px; text-align: center;">
                        <strong>Contact Support</strong> <br>
                        📞 <strong>+91 8849286008</strong> <br>
                        ✉️ <a href="mailto:avip56325@gmail.com" style="color: #555 !important; text-decoration: none;">avip56325@gmail.com</a>
                    </p>
                </div>
            `,
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found" });
        }


        if (user.resettoken !== token) {

            return res.status(400).json({ message: "Reset token is invalid or expired" });
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        user.resettoken = null;
        await user.save();

        res.json({ message: "Password has been reset successfully!" });

    } catch (error) {

        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { loginController, registerController, forgetpassword, resetpassword };