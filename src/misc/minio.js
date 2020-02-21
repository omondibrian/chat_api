const minio = require('minio')
const minioBucket = "image-storage";
const minioHost = process.env.MINIO_HOST || 'localhost'
export async function initMinIO() {
 
  const client = new minio.Client({
    endPoint: minioHost,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin"
  });
  let success = false;
  while (!success) {
    try {
      if (!(await client.bucketExists(minioBucket))) {
        await client.makeBucket(minioBucket);
      }
      success = true;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
 
  return client;
  }