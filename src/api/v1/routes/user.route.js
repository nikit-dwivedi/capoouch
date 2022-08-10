const express = require("express");
const router = express.Router();

const { register, emailVerification } = require('../controllers/user.controller.js');

router.post('/register', register);
router.post('/verify', emailVerification);

module.exports = router;