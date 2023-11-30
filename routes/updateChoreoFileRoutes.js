const express = require('express');
const router = express.Router();
const updateChoreoFile = require('../logic/endpoints/updateChoreoFile');

module.exports = (s3) => {
    router.post('/postChoreoUpdate', async (req, res) => {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID is missing' });
            }
            const result = await updateChoreoFile(s3, sessionId, req.body);
            
            if (result === 'success') {
                res.json({ message: "success" });
            } else {
                res.status(500).json({ message: 'Update failed' });
            }
        } catch (error) {
            console.error('Error during choreography update:', error);
            res.status(500).json({ message: 'Server error during choreography update' });
        }
    });

    return router;
};
