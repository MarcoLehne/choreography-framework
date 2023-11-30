const express = require('express');
const router = express.Router();
const getChoreoData = require('../logic/endpoints/getChoreoData'); 

module.exports = (s3) => {
    router.get('/getChoreoData', async (req, res) => {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID is missing' });
            }
            const data = await getChoreoData(s3, sessionId);
            res.json(data);
        } catch (error) {
            console.error('Error fetching choreo data:', error);
            res.status(500).json({ message: 'Error fetching choreo data' });
        }
    });

    return router;
};
