const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3client = require("../../aws/s3Client");

const deleteS3Object = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3client.send(new DeleteObjectCommand(params));
    console.log(`Successfully deleted ${key} from ${params.Bucket}`);
  } catch (err) {
    console.error(`Failed to delete ${key} from ${params.Bucket}:`, err);
    throw err;
  }
};

module.exports = { deleteS3Object };
