const express = require("express");
const router = express.Router();

const { register, emailVerification, login } = require('../controllers/user.controller.js');

router.post('/register', register);
router.post('/verify', emailVerification);
router.post('/login',login)

module.exports = router;