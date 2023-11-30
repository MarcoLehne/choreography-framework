const { PutObjectCommand } = require('@aws-sdk/client-s3');
const bucketName = process.env.AWS_S3_BUCKET;
const readDirectoriesJson = require('./readDirectoriesJson');
const writeDirectoriesJson = require('./writeDirectoriesJson');

async function updateDirectoriesJson(s3, sessionId, creationDate = null) {
    const directoriesData = await readDirectoriesJson(s3);
    if (creationDate) {
        directoriesData[sessionId] = creationDate;
    } else {
        delete directoriesData[sessionId];
    }

    await writeDirectoriesJson(s3, directoriesData);
}

module.exports = updateDirectoriesJson;