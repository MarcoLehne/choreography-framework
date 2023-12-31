const { GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const streamToString = require('../aws/streamToString');

async function getChoreoData(s3, sessionId) {
    const bucketName = process.env.AWS_S3_BUCKET;
    
    try {
        const listParams = {
            Bucket: bucketName,
            Prefix: `${sessionId}/`
        };
        const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

        const choreoFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.choreo'));
        if (!choreoFile) {
            throw new Error('No .choreo file found');
        }

        const data = await s3.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: choreoFile.Key
        }));
        const choreoData = await streamToString(data.Body);
        return JSON.parse(choreoData);

    } catch (error) {
        console.error('Error getting choreo data:', error);
        throw error;
    }
}

module.exports = getChoreoData;
