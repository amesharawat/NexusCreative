import { NextResponse } from 'next/server';
import { uploadToCloudinary, UploadFolder } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as UploadFolder) ?? 'projects';
    const resourceType = (formData.get('resourceType') as 'image' | 'video' | 'raw') ?? 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToCloudinary(buffer, folder, resourceType);
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('Upload route error:', err);
    const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : 'Upload failed');
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
