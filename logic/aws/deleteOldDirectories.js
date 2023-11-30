const { DeleteObjectsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const readDirectoriesJson = require('./readDirectoriesJson');
const updateDirectoriesJson = require('./updateDirectoriesJson');

const bucketName = process.env.AWS_S3_BUCKET; // Replace with your actual S3 bucket name

async function deleteOldDirectories(s3) {

    try {
        let directoriesData = await readDirectoriesJson(s3);
        let isUpdated = false;

        for (const [sessionId, creationDate] of Object.entries(directoriesData)) {
            const creationTime = new Date(creationDate).getTime();
            if (Date.now() - creationTime > 86400000) { // 24 hours in milliseconds
                // List all objects with the prefix 'sessionId/'
                const listParams = {
                    Bucket: bucketName,
                    Prefix: `${sessionId}/` // Assuming the sessionId is the directory name
                };
    
                try {
                    const listedObjects = await s3.send(new ListObjectsV2Command(listParams));
                    if (listedObjects.Contents.length === 0) continue;
    
                    // Prepare a list of objects to delete
                    const objectsToDelete = listedObjects.Contents.map(({ Key }) => ({ Key }));
    
                    if (objectsToDelete.length > 0) {
                        const deleteParams = {
                            Bucket: bucketName,
                            Delete: { Objects: objectsToDelete }
                        };
    
                        await s3.send(new DeleteObjectsCommand(deleteParams));
                        console.log(`Deleted objects with prefix ${sessionId}/ from bucket ${bucketName}`);
                    }
                } catch (error) {
                    console.error(`Error deleting objects with prefix ${sessionId}/:`, error);
                }
    
                await updateDirectoriesJson(s3, sessionId);
            }
        }
    } catch (error) {
        console.error('Error during scheduled deletion:', error);
    }
}

module.exports = deleteOldDirectories;