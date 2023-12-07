const { PutObjectCommand } = require('@aws-sdk/client-s3');

async function createChoreoFile(s3, sessionId, formData, bucketName) {
    // Update formData as per your logic
    formData.view = [];
    for (const timestamp of formData.timestamps) {
        formData.view.push({
            timestamp: timestamp.toString().trim(),
            chapter: 0,
            sequence: 0,
            prompt: 0,
        });
    }

    formData.sequence_compendium = [];
    formData.prompts = []
    formData.W = 512;
    formData.H = 512;
    formData.fps = 25;
    formData.scale = 20;
    formData.steps = 15;
    formData.seed = 10000;
    
    // Convert formData to JSON string
    const jsonString = JSON.stringify(formData, null, 2);
    const fileKey = `${sessionId}/${formData.name}.choreo`;

    // Upload JSON string to S3
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: jsonString,
            ContentType: 'application/json'
        };

        await s3.send(new PutObjectCommand(params));
        console.log(`JSON data has been written to ${fileKey} in S3 bucket`);

        return 'success';
    } catch (error) {
        console.error('An error occurred while writing JSON to S3:', error);
        return 'errorWritingFile';
    }
}

module.exports = createChoreoFile;
