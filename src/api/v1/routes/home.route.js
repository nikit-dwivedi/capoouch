const express = require('express');
const { authenticateVerifiedyUser } = require('../middlewares/authToken');
const router = express.Router();

const { home } = require('../controllers/scree.controller');

router.get('/home',authenticateVerifiedyUser,home)

module.exports = router;