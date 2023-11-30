const express = require('express');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const createSettingsFile = require('../logic/endpoints/createSettingsFile');

module.exports = (s3) => {
    const router = express.Router();

    router.get('/downloadSettings', async (req, res) => {
        const sessionId = req.headers['x-session-id'];
        const fromTimestamp = req.headers['from-timestamp-index'];
        const toTimestamp = req.headers['to-timestamp-index'];
        const forWebuiOrColab = req.headers['for-webui-or-colab'];

        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is missing' });
        }

        try {
            const settingsKey = await createSettingsFile(s3, sessionId, fromTimestamp, toTimestamp, forWebuiOrColab);
            
            if (settingsKey !== 'failure') {
                const settingsData = await s3.send(new GetObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET,
                    Key: settingsKey
                }));
                
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', `attachment; filename=settings.txt`);
                settingsData.Body.pipe(res);
            } else {
                res.status(500).json({ message: 'Settings file creation failed' });
            }
        } catch (error) {
            console.error('Error during settings file download:', error);
            res.status(500).json({ message: 'Error downloading settings file' });
        }
    });

    return router;
};
