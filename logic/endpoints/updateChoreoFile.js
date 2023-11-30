const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const streamToString = require('./streamToString');

async function updateChoreoFile(s3, sessionId, updateData) {
    const bucketName = process.env.AWS_S3_BUCKET;

    try {
        // List objects with the session ID as a prefix
        const listParams = {
            Bucket: bucketName,
            Prefix: `${sessionId}/`
        };
        const listedObjects = await s3.send(new ListObjectsV2Command(listParams));

        // Find the .choreo file
        const choreoFile = listedObjects.Contents.find(obj => obj.Key.endsWith('.choreo'));
        if (!choreoFile) {
            throw new Error('No .choreo file found');
        }

        // Fetch the .choreo file from S3
        const data = await s3.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: choreoFile.Key
        }));
        const fileContent = await streamToString(data.Body);
        const jsonData = JSON.parse(fileContent);

        jsonData.view = counterCheckView(updateData.view, updateData.promptsCompendium, updateData.sequenceCompendium);
        jsonData.prompts = updateData.promptsCompendium;
        jsonData.sequence_compendium = updateData.sequenceCompendium; 
        jsonData.width = updateData.setup.width;
        jsonData.height = updateData.setup.height;
        jsonData.scale = updateData.setup.scale;
        jsonData.steps = updateData.setup.steps;
        jsonData.fps = updateData.setup.fps;
        jsonData.seed = updateData.setup.seed;
    
        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: choreoFile.Key,
          Body: JSON.stringify(jsonData, null, 2),
          ContentType: 'application/json'
      }));

      return 'success';
  } catch (error) {
      console.error('Failed to update choreo file:', error);
      throw error;
  }
}

function counterCheckView(view, promptsCompendium, sequenceCompendium) {
  return view.map(item => {
    let updatedItem = { ...item };
    if (updatedItem.sequence > sequenceCompendium.length) {
      updatedItem.sequence = 0;
    }
    if (updatedItem.prompt > promptsCompendium.length) {
      updatedItem.prompt = 0;
    }
    return updatedItem;
  });
}

module.exports = updateChoreoFile;
