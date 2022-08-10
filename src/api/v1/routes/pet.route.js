const express = require('express');
const router = express.Router();

const { addPet, editPet, petInfo } = require('../controllers/pet.controller');
const { authenticateVerifiedyUser } = require('../middlewares/authToken');

router.post('/register', authenticateVerifiedyUser, addPet);
router.post('/edit', authenticateVerifiedyUser, editPet);
router.get('/', authenticateVerifiedyUser, petInfo);

module.exports = router;