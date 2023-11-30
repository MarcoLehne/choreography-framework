const express = require('express');
const router = express.Router();
const createChoreoFile = require('../logic/endpoints/createChoreoFile');

router.post('/createChoreoFile', async (req, res) => {

    try {
        const result = await createChoreoFile(__dirname, req.headers['x-session-id'], req.body);
        
        if (result === 'success') {
            res.json({ message: "success" });
        } else {
            res.status(500).json({ message: 'Creation failed' });
        }
    } catch (error) {
        console.error('Error during file creation:', error);
        res.status(500).json({ message: 'Server error during file creation' });
    }
});

module.exports = router;