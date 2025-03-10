const express = require('express');
const {loginController, registerController, forgetpassword, resetpassword} = require('../controllers/UserController');

const router  = express.Router();

router.post('/login',loginController);

router.post('/register',registerController);

router.post('/forget-password', forgetpassword);

router.post('/reset-password', resetpassword);


module.exports = router