const express = require('express');
const { GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

module.exports = (s3) => {
    const router = express.Router();

    router.get('/downloadImage', async (req, res) => {
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

            const imageFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.jpg'));
            if (imageFile) {
                const imageData = await s3.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: imageFile.Key
                }));

                res.setHeader('Content-Type', 'image/jpeg');
                res.setHeader('Content-Disposition', `attachment; filename="${path.basename(imageFile.Key)}"`);
                imageData.Body.pipe(res);
            } else {
                res.status(404).json({ message: 'Image file not found' });
            }
        } catch (error) {
            console.error('Error fetching image file:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};
