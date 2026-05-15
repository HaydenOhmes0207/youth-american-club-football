'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const teamId = formData.get('teamId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!teamId) {
      return NextResponse.json({ error: 'No teamId provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // For prototype: Return a mock URL using a placeholder image service
    // In production, this would upload to actual storage (Supabase, S3, etc.)
    const mockUrl = `https://placehold.co/200x200/1e40af/ffffff?text=${encodeURIComponent(teamId.slice(0, 8))}`;

    return NextResponse.json({ success: true, url: mockUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
