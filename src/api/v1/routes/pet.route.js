const express = require('express');
const router = express.Router();

const { addPet, editPet, petInfo, homeImage } = require('../controllers/pet.controller');
const { authenticateVerifiedyUser } = require('../middlewares/authToken');
const uploads = require('../middlewares/upload');

router.post('/register', authenticateVerifiedyUser, uploads.single('image'), addPet);
router.post('/edit', authenticateVerifiedyUser, uploads.single('image'), editPet);
router.get('/', authenticateVerifiedyUser, petInfo);
router.post('/change', authenticateVerifiedyUser, uploads.single('image'), homeImage)

module.exports = router;