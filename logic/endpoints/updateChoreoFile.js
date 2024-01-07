const { GetObjectCommand, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const streamToString = require('../aws/streamToString');

async function updateChoreoFile(s3, sessionId, updateData) {
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
        const fileContent = await streamToString(data.Body);
        const jsonData = JSON.parse(fileContent);

        if ("view" in updateData && "promptsCompendium" in updateData && "sequenceCompendium" in updateData) {
          jsonData.view = counterCheckView(updateData.view, updateData.promptsCompendium, updateData.sequenceCompendium);
        }

        if ("prompts" in updateData) jsonData.prompts = updateData.promptsCompendium;
        if ("sequenceCompendium" in updateData) jsonData.sequence_compendium = updateData.sequenceCompendium; 
        if ("setup" in updateData) {
          jsonData.W = updateData.setup.W;
          jsonData.H = updateData.setup.H;
          jsonData.scale = updateData.setup.scale;
          jsonData.steps = updateData.setup.steps;
          jsonData.fps = updateData.setup.fps;
          jsonData.seed = updateData.setup.seed;
          jsonData.init_image = updateData.setup.init_image;
        }
    
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
