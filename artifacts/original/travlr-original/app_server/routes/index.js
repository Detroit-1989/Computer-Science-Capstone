const express = require('express');
const router = express.Router();

const ctrlTravel = require('../controllers/travel');

router.get('/trips', ctrlTravel.tripsList);

module.exports = router;