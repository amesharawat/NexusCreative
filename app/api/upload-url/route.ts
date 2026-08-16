import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { folder, fileName } = await req.json();
    const bucketName = 'portfolio';
    const timestamp = Date.now();
    const cleanFileName = (fileName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder || 'general'}/${timestamp}_${cleanFileName}`;

    // Create a signed upload URL valid for 2 hours
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.error('Create signed URL error:', error);
      return NextResponse.json({ error: error?.message || 'Failed to create upload URL' }, { status: 500 });
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: unknown) {
    console.error('Upload URL route error:', err);
    return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
  }
}
