const { PutObjectCommand } = require('@aws-sdk/client-s3');
const bucketName = process.env.AWS_S3_BUCKET;

async function writeDirectoriesJson(s3, directoriesData) {
    const jsonString = JSON.stringify(directoriesData, null, 2);
    await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: process.env.DIRECTORIES_FILE_KEY,
        Body: jsonString,
        ContentType: 'application/json'
    }));
}

module.exports = writeDirectoriesJson;