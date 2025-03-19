import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

class DigitalOceanUploader {
  constructor() {
    this.s3Client = new S3Client({
      endpoint: "https://fra1.digitaloceanspaces.com",
      forcePathStyle: false,
      region: "fra1",
      credentials: {
        accessKeyId: window.imageClientId,
        secretAccessKey: window.imageClientSecret
      }
    });
  }

  upload(file) {
    const client = this.s3Client;
    return new Promise(function(resolve,reject) {
      const reader = new FileReader();
      reader.onload = function(e) {
        (async function() {
          const command = new PutObjectCommand({
            Bucket: window.imageBucketId,
            Key: `rich-text-uploads/${file.name}`,
            Body: reader.result,
            ContentType: file.type,
            ACL: "public-read"
          });

          try {
            const response = await client.send(command);
            resolve(`https://bidders-highway.fra1.digitaloceanspaces.com/rich-text-uploads/${file.name}`);
          }
          catch(err) {
            console.error("Upload failed");
            reject("failed");
          }
        })();
      }
      reader.readAsArrayBuffer(file);
    });
  }
}

const uploader = new DigitalOceanUploader();
export default uploader;
