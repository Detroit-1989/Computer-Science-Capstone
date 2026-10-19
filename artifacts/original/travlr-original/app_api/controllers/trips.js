const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

const tripsList = async (req, res) => {

    try {
        const trips = await Trip.find();
        res 
            .status(200)
            .json(trips);
    } catch (err) {

        res 
            .status(500)
            .json(err);
    }
};

const tripsFindByCode = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.tripCode);

        if (!trip) {

            return res 
                .status(404)
                .json({"message": "Trip not found"});
        }

        res 
            .status(200)
            .json(trip);


    } catch (err) {

        res
            .status(500)
            .json(err);
    }

};

const tripsAddTrip = async (req, res) => {

    try {

        const trip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        res
            .status(201)
            .json(trip);

    } catch (err) {

        res
            .status(400)
            .json(err);
    }
};


const tripsUpdate = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.tripCode);

        if (!trip) {
            return res
                .status(404)
                .json({ "message": "Trip not found" });
        }

        trip.name = req.body.name;
        trip.length = req.body.length;
        trip.start = req.body.start;
        trip.resort = req.body.resort;
        trip.perPerson = req.body.perPerson;
        trip.image = req.body.image;
        trip.description = req.body.description;

        await trip.save();

        res
            .status(200)
            .json(trip);

    } catch (err) {

        res
            .status(500)
            .json(err);

    }

};

const tripsDeleteTrip = async (req, res) => {
  try {
    console.log('DELETE tripId:', req.params.tripId);

    const deletedTrip = await Trip.findByIdAndDelete(
      req.params.tripId
    );

    console.log('Deleted trip:', deletedTrip);

    if (!deletedTrip) {
      return res.status(404).json({
        message: 'Trip not found'
      });
    }

    return res.status(200).json({
      message: 'Trip deleted successfully'
    });

  } catch (err) {
    console.error('DELETE ERROR:', err);

    return res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
    tripsList, tripsFindByCode, tripsAddTrip, tripsUpdate, tripsDeleteTrip
};