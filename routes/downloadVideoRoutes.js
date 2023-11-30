const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const videoRouter = express.Router();

videoRouter.get('/downloadVideo', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is missing' });
        }

        const directoryPath = path.join(__dirname, '..', `uploads/${sessionId}`);
        const files = await fs.readdir(directoryPath);

        const videoFile = files.find(file => file.endsWith('.mp4'));
        if (videoFile) {
            const filePath = path.join(directoryPath, videoFile);
            res.download(filePath);
        } else {
            res.status(404).json({ message: 'Video file not found' });
        }
    } catch (error) {
        console.error('Error fetching video file:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = videoRouter;
