const express = require('express');
const router = express.Router();

const { expressjwt: jwt } = require('express-jwt');

const ctrlTrips = require('../controllers/trips');

const ctrlAuth = require('../controllers/authentication');

const auth = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256']}); 

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/trips', ctrlTrips.tripsList);
router.get('/trips/:tripCode', ctrlTrips.tripsFindByCode);

router.post('/trips', auth, ctrlTrips.tripsAddTrip); 

router.put('/trips/:tripCode', auth, ctrlTrips.tripsUpdate);

router.delete('/trips/:tripId', auth, ctrlTrips.tripsDeleteTrip);

module.exports = router;