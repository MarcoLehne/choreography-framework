const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

router.get('/downloadImage', async (req, res) => {

    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is missing' });
        }

        const directoryPath = path.join(__dirname, '..', `uploads/${sessionId}`);
        const files = await fs.readdir(directoryPath);

        const imageFile = files.find(file => file.endsWith('.jpg'));
        if (imageFile) {
            const filePath = path.join(directoryPath, imageFile);
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'Image file not found' });
        }
    } catch (error) {
        console.error('Error fetching image file:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
