import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import streamifier from 'streamifier';
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'neurosoftic'
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary returned no result'));
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const storage = multer.memoryStorage();
export const upload = multer({ storage });
