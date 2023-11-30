const express = require('express');
const { GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

module.exports = (s3) => {
    const videoRouter = express.Router();

    videoRouter.get('/downloadVideo', async (req, res) => {
        const sessionId = req.headers['x-session-id'];
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is missing' });
        }

        try {
            const bucketName = process.env.AWS_S3_BUCKET;
            const listedObjects = await s3.send(new ListObjectsV2Command({
                Bucket: bucketName,
                Prefix: `${sessionId}/`
            }));

            const videoFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.mp4'));
            if (videoFile) {
                const videoData = await s3.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: videoFile.Key
                }));

                res.setHeader('Content-Type', 'video/mp4');
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(videoFile.Key)}"`);
                videoData.Body.pipe(res);
            } else {
                res.status(404).json({ message: 'Video file not found' });
            }
        } catch (error) {
            console.error('Error fetching video file:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return videoRouter;
};
