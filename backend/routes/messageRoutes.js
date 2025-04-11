const express = require('express');
const router = express.Router();
const { getMessages, createMessage } = require('../controllers/MessageController');

router.get('/:ticketId', getMessages);
router.post('/', createMessage);

module.exports = router;
