import { supabaseAdmin } from '@/lib/supabase';
import { v2 as cloudinary } from 'cloudinary';

export type UploadFolder = 'projects' | 'films' | 'ads' | 'ai-images' | 'resumes';

// Seamless upload using Supabase Storage (primary) with Cloudinary fallback
export async function uploadFile(
  fileBuffer: Buffer,
  folder: UploadFolder,
  fileName: string,
  contentType: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ url: string; publicId: string }> {
  try {
    // 1. Try Supabase Storage first
    const bucketName = 'portfolio';
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${timestamp}_${cleanFileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: contentType || 'application/octet-stream',
        upsert: true,
      });

    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);

      return {
        url: publicUrlData.publicUrl,
        publicId: uploadData.path,
      };
    }

    console.warn('Supabase storage fallback to Cloudinary:', uploadError?.message);
  } catch (err) {
    console.warn('Supabase upload exception, attempting Cloudinary:', err);
  }

  // 2. Fallback to Cloudinary if configured
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim(),
      api_key: process.env.CLOUDINARY_API_KEY?.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
      secure: true,
    });

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `nexuscreative/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed'));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

export async function deleteFile(publicId: string) {
  try {
    await supabaseAdmin.storage.from('portfolio').remove([publicId]);
  } catch {
    // Ignore error
  }
}
