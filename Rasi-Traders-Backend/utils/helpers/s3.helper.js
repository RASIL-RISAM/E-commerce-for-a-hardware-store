import s3Client from "../config/s3.config.js";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadFileToS3(fileBuffer, fileName, folder) {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${fileName}-${Date.now()}`,
        Body: fileBuffer,
    }

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return url
}

async function deleteFileFromS3(key){
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }
    const command = new DeleteObjectCommand(params)
    await s3Client.send(command)
}


export  {uploadFileToS3, deleteFileFromS3}