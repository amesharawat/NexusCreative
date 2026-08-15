import { v2 as cloudinary } from 'cloudinary';

export type UploadFolder = 'projects' | 'films' | 'ads' | 'ai-images' | 'resumes';

function getCloudinary() {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
  return cloudinary;
}

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: UploadFolder,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ url: string; publicId: string }> {
  const client = getCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder: `nexuscreative/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload stream error:', error);
          return reject(error || new Error('Upload returned no result'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') {
  const client = getCloudinary();
  return client.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
