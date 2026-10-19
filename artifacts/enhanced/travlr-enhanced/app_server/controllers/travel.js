/* GET travel view */

const mongoose = require('mongoose');

const Trip = mongoose.model('Trip');

const tripsList = async (req, res) => {

    try {
        const trips = await Trip.find({});

        res.status(200).json(trips);
    }

    catch (err) {
        res.status(404).json(err);
    }
};

module.exports = { tripsList};