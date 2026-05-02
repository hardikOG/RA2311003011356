const express = require('express');
const { Log } = require('../logging_middleware/logger');

const appInstance = express();
const portNum = 3000; 

appInstance.use(express.json());

// mathematical logic to figure out how many miles till the next 5000 milestone
const calculateGap = (milesTraveled) => {
    const INTERVAL = 5000;
    const remainder = milesTraveled % INTERVAL;
    // if at exactly 5000, 10000 etc, return INTERVAL, else return the diff
    return (remainder === 0) ? INTERVAL : (INTERVAL - remainder);
};

appInstance.post('/api/v1/maintenance/check', async (req, res) => {
    const { modelName, odometer } = req.body;

    // simple check to make sure body isnt empty
    if (!modelName || odometer === undefined) {
        await Log("backend", "error", "controller", "Payload missing crucial fields.");
        return res.status(400).json({ error: "Vehicle model and odometer required." });
    }

    const milesLeft = calculateGap(odometer);
    const alertLimit = 500; // miles remaining trigger

    try {
        if (milesLeft <= alertLimit) {
            // urgency is high if we are close to the limit
            await Log("backend", "warn", "handler", `Alert: ${modelName} needs maintence in ${milesLeft} miles.`);
        } else {
            await Log("backend", "info", "handler", `Status check: ${modelName} is okay for now.`);
        }

        return res.status(200).json({
            vehicle_type: modelName,
            remaining_miles: milesLeft,
            priority: milesLeft <= alertLimit ? "HIGH" : "NORMAL",
            processed_at: new Date().toISOString()
        });

    } catch (error) {
        await Log("backend", "fatal", "service", `App crashed: ${error.message}`);
        res.status(500).json({ error: "Internal processing error" });
    }
});

appInstance.listen(portNum, () => {
    console.log(`Backend server ready on port ${portNum}`);
});