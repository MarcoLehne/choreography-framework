const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const streamToString = require('./streamToString'); // Utility function to convert stream to string
const processUserInput = require('../util/processUserInput');
const mergeJson = require('../util/mergeJson');

async function createSettingsFile(s3, sessionId, fromTimestamp, toTimestamp, forWebuiOrColab) {
    const bucketName = process.env.AWS_S3_BUCKET;

    try {
        // Find the .choreo file from S3
        const listedObjects = await s3.send(new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: `${sessionId}/`
        }));
        const choreoFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.choreo'));
        if (!choreoFile) {
            console.error('No .choreo file found');
            return 'failure';
        }

        // Read the .choreo file
        const choreoData = await s3.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: choreoFile.Key
        }));
        const choreoObject = JSON.parse(await streamToString(choreoData.Body));

        // Process user input and merge JSON
        processUserInput(fromTimestamp, toTimestamp, choreoObject);
        let settings = require('../util/template_settings.json');
        mergeJson(settings, choreoObject);

        // Create settings.txt content
        const settingsContent = JSON.stringify(settings, null, 2);

        // Store settings.txt in S3 (temporarily)
        const settingsKey = `${sessionId}/settings.txt`;
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: settingsKey,
            Body: settingsContent,
            ContentType: 'text/plain'
        }));

        return settingsKey; // Return the key to the created settings file in S3
    } catch (error) {
        console.error('Error in createSettingsFile:', error);
        return 'failure';
    }
}

module.exports = createSettingsFile;
