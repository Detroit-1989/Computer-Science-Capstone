const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const mongoURI = 'mongodb://127.0.0.1:27017/travlr';

async function importTrips() {
    try {
        // Connect to the existing Travlr database.
        await mongoose.connect(mongoURI);

        console.log('Connected to MongoDB.');

        // Read the Milestone Three JSON file.
        const filePath = path.join(
            __dirname,
            'data',
            'milestone3-trips.json'
        );

        const trips = JSON.parse(
            fs.readFileSync(filePath, 'utf8')
        );

        if (!Array.isArray(trips)) {
            throw new Error(
                'milestone3-trips.json must contain a JSON array.'
            );
        }

        console.log(`JSON records found: ${trips.length}`);

        const collection =
            mongoose.connection.collection('trips');

        // Find any codes that already exist in MongoDB.
        const newCodes = trips.map(trip => trip.code);

        const existingTrips = await collection
            .find(
                { code: { $in: newCodes } },
                { projection: { code: 1 } }
            )
            .toArray();

        const existingCodes = new Set(
            existingTrips.map(trip => trip.code)
        );

        // Skip any record whose code already exists.
        const tripsToInsert = trips
            .filter(trip => !existingCodes.has(trip.code))
            .map(trip => ({
                ...trip,
                start: new Date(trip.start)
            }));

        if (tripsToInsert.length === 0) {
            console.log(
                'No new trips need to be imported.'
            );
        } else {
            const result = await collection.insertMany(
                tripsToInsert
            );

            console.log(
                `Successfully imported ${result.insertedCount} trip(s).`
            );
        }

        console.log(
            `Skipped ${trips.length - tripsToInsert.length} existing trip(s).`
        );

        const totalTrips =
            await collection.countDocuments();

        console.log(
            `Total trips now in MongoDB: ${totalTrips}`
        );

    } catch (error) {
        console.error(
            'Import failed:',
            error.message
        );
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
    }
}

importTrips();