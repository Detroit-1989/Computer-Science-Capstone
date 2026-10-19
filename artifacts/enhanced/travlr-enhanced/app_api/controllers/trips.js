const mongoose = require('mongoose');
const Trip = mongoose.model('Trip');

const tripsList = async (req, res) => {

    try {
        const query = {};

        // Filtering by resort
        if (req.query.reesort) {
            query.resort = req.query.resort;
        }

        // Filtering by trip duration
        if (req.query.length) {
            query.length = req.query.length;
        }

        // FIltering by maximum price
        if (req.query.maxPrice) {
            const maxPrice = Number(req.query.maxPrice);

            if (Number.isNaN(maxPrice) || maxPrice < 0) {
                return res.status(400).json({
                    message: 'maxPrice must be valid non-negative'
                });
            }

            query.perPerson = { $lte: maxPrice };
        }

        // Determine sorting method
        let sort = { name: 1 };

        switch (req.query.sort) {
            case 'priceLow':
                sort = { perPerson: 1 };
                break;

            case 'priceHigh':
                sort = { perPerson: -1 };
                break;

            case 'nameAZ':
                sort = { name: 1 };
                break;

            case 'nameZA':
                sort = { name: -1 };
                break;

            case 'startSoonest':
                sort = { start: 1 };
                break;

            case 'startLatest':
                sort = { start: -1 };
                break;
        }

        const trips = await Trip.find(query)
            .sort(sort)
            .lean()
            .exec();

        return res.status(200).json(trips);

    } catch (err) {
        console.error('GET TRIPS ERROR:', err);

        return res.status(500).json({
            message: 'Unable to retrieve trips',
            error: err.message
        });
    }
};

const tripsFindById = async (req, res) => {

    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.tripId)) {

            return res.status(400).json({

                message: 'Invalid trip ID'

            });
        }

        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {

            return res
                .status(404)
                .json({

                    message: 'Trip not found'

                });
        }

        return res
            .status(200)
            .json(trip);

    } catch (err) {

        console.error('GET TRIP ERROR:', err);

        return res
            .status(500)
            .json({
                message: 'Unable to retrieve trip'
            });
    }
};

const tripsAddTrip = async (req, res) => {

    try {

        const requiredFields = [

            'code',
            'name',
            'length',
            'start',
            'resort',
            'perPerson',
            'image',
            'description'

        ];

        const missingFields = requiredFields.filter(

            (field) =>
                req.body[field] === undefined ||
                req.body[field] === null ||
                req.body[field] === ''

        );

        if (missingFields.length > 0) {

            return res.status(400).json({

                message: 'Missing required trip fields',
                missingFields

            });
        }

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

        return res
            .status(201)
            .json(trip);

    } catch (err) {

        // The MongoDB duplicate-key error
        if (err.code === 11000) {

            return res.status(409).json({

                message: 'A trip with this code already exist'

            });
        }

        // Mongoose schema-validation error
        if (err.name === 'ValidationError') {

            return res.status(400).json({

                message: 'Invalid trip data'

            });
        }

        console.error('CREATE TRIP ERROR:', err);

        return res.status(500).json({

            message: 'Unable to create trip'

        });
    }

};


const tripsUpdate = async (req, res) => {

    try {

        const trip = await Trip.findById(req.params.tripId);

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

    const deletedTrip = await Trip.findByIdAndDelete(
      req.params.tripId
    );


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
    tripsList, tripsFindById, tripsAddTrip, tripsUpdate, tripsDeleteTrip
};