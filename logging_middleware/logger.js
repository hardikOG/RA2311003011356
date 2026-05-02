const axios = require('axios');

// Using the credentials provided during registration
const userCreds = {
    email: "hg7243@srmist.edu.in",
    name: "Hardik Grover",
    rollNo: "RA2311003011356",
    accessCode: "QkbpxH",
    clientID: "b4f224ce-70c8-4110-8903-e498dafb99ce",
    clientSecret: "rhaBmRqgyAfPhhVu"
};

/**
 * reusable log function to send data to the evaluation server
 * this handles auth automatically so i dont have to do it every time
 */
async function Log(stack, level, pkg, message) {
    try {
        // Getting the bearar token
        const authPromise = await axios.post('http://20.207.122.201/evaluation-service/auth', userCreds);
        const jwtToken = authPromise.data.access_token;

        // send the log data
        const payload = { stack, level, package: pkg, message };
        const result = await axios.post('http://20.207.122.201/evaluation-service/logs', payload, {
            headers: { Authorization: `Bearer ${jwtToken}` }
        });

        console.log(`Log successfully sent! ID: ${result.data.logID}`);
    } catch (err) {
        // to print the error details if somethingg fails
        console.error("Logger encountered an issue:", err.response ? err.response.data : err.message);
    }
}

module.exports = { Log };