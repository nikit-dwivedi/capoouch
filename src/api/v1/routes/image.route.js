const express = require('express');
const router = express.Router();

const { addNewAvatar, addNewIcon, getIconList, getAvatarList } = require('../controllers/image.controller')

router.post('/icon', addNewIcon);
router.post('/avatar', addNewAvatar);
router.get('/icon', getIconList);
router.get('/avatar', getAvatarList);

module.exports = router