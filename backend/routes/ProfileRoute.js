const express = require('express');
const {getprofile, updateProfile, updateContact, updateProfessional} = require('../controllers/ProfileController');

const router  = express.Router();


router.get('/get-profile',getprofile);

router.put('/update-profile', updateProfile);

router.put('/update-contact', updateContact);

router.put('/update-professional', updateProfessional);


module.exports = router