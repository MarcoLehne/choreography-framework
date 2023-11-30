const { GetObjectCommand } = require('@aws-sdk/client-s3');
const bucketName = process.env.AWS_S3_BUCKET;
const streamToString = require('./streamToString');

async function readDirectoriesJson(s3) {
  const data = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: process.env.DIRECTORIES_FILE_KEY }));
  const jsonData = await streamToString(data.Body);
  return JSON.parse(jsonData);
}

module.exports = readDirectoriesJson;