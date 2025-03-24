const express = require('express');
const {loginController, registerController, forgetpassword, resetpassword, enable2FA, verifyOTP} = require('../controllers/UserController');

const router  = express.Router();

router.post('/login',loginController);

router.post('/register',registerController);

router.post('/forget-password', forgetpassword);

router.post('/reset-password', resetpassword);

router.post('/enable-2fa', enable2FA);

router.post("/verify-otp", verifyOTP);


module.exports = router