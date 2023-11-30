const express = require('express');
const path = require('path');
const { GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

module.exports = (s3) => {
    const router = express.Router();

    router.get('/downloadChoreoFile', async (req, res) => {
        try {
            const sessionId = req.headers['x-session-id'];
            if (!sessionId) {
                return res.status(400).json({ message: 'Session ID is missing' });
            }

            const bucketName = process.env.AWS_S3_BUCKET;
            const listedObjects = await s3.send(new ListObjectsV2Command({
                Bucket: bucketName,
                Prefix: `${sessionId}/`
            }));

            const choreoFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.choreo'));
            if (choreoFile) {
                const choreoData = await s3.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: choreoFile.Key
                }));

                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(choreoFile.Key)}"`);
                choreoData.Body.pipe(res);
            } else {
                res.status(404).json({ message: 'Choreo file not found' });
            }
        } catch (error) {
            console.error('Error fetching choreo file:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
