import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('ai_images')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Images GET error:', error);
      return NextResponse.json([]);
    }
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('Images catch error:', err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('ai_images')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Images POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Images POST catch error:', err);
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}
