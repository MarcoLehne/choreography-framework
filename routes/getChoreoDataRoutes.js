const express = require('express');
const router = express.Router();
const getChoreoData = require('../logic/endpoints/getChoreoData'); // Adjust the path as needed

router.get('/getChoreoData', async (req, res) => {

    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is missing' });
        }
        const data = await getChoreoData(sessionId, __dirname);
        res.json(data);
    } catch (error) {
        console.error('Error fetching choreo data:', error);
        res.status(500).json({ message: 'Error fetching choreo data' });
    }
});

module.exports = router;
