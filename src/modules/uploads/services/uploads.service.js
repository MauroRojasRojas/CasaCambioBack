import { s3 } from "../../../core/aws/s3.config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

export const uploadsService = {

  async generatePresignedUrl({ folder, filename, contentType }) {

    const safeFilename = sanitizeFilename(filename);

    const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${safeFilename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      ContentType: contentType
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

    return {
      uploadUrl,
      finalUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key
    };
  }

};

function sanitizeFilename(filename) {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/\+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');
}