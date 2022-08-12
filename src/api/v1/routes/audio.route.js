const express = require('express');
const router = express.Router();

const { addNewAudio, getAudioList, removeAudio } = require('../controllers/audio.controller');
const { authenticateVerifiedyUser } = require('../middlewares/authToken');
const uploads = require('../middlewares/upload');

router.post('/add', authenticateVerifiedyUser, uploads.single('audio'), addNewAudio);
router.get('/', authenticateVerifiedyUser, getAudioList);
router.post('/remove', authenticateVerifiedyUser, removeAudio);

module.exports = router