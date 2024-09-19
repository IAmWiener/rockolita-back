const express = require('express');
const { addSong, getQueue, playNextSong } = require('../controllers/queueController');
const router = express.Router();

router.post('/add', addSong);
router.get('/queue', getQueue);
router.post('/next', playNextSong);

module.exports = router;