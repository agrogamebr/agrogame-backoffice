import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gsutilUri = searchParams.get('url');

    if (!gsutilUri) {
      return NextResponse.json(
        { error: 'url parameter is required' },
        { status: 400 }
      );
    }

    const endpoint = `/api/files/proxy?url=${encodeURIComponent(gsutilUri)}`;

    const response = await apiFetch(endpoint);

    if (!response.ok) {
      console.error(`[File Proxy] Failed to fetch file: ${response.status}`);
      return new NextResponse(null, { status: response.status });
    }

    const fileData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[File Proxy] Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
