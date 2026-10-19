const mongoose = require('mongoose');

const dbURI = 'mongodb://127.0.0.1:27017/travlr';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {

    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

const gracefulShutdown = async (message) => {
    await mongoose.connection.close(); console.log(`Mongoose disconnected through ${message}`);
};

process.once('SIGUSR2', async () => {
    await gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
    await gracefulShutdown('application termination');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await gracefulShutdown('application shutdown');
    process.exit(0);
});

require('../models/trips');
require('../models/users');