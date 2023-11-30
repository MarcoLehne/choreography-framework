const express = require('express');
const router = express.Router();
const path = require('path');
const updateChoreoFile = require('../logic/endpoints/updateChoreoFile');

router.post('/postChoreoUpdate', async (req, res) => {
    try {
        const result = await updateChoreoFile(__dirname, req.headers['x-session-id'], req.body);
        
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

module.exports = router;