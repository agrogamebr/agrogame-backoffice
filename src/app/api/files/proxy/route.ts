import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/services/auth.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const backendUrl = `${API_BASE_URL}/api/files/proxy?url=${encodeURIComponent(url)}`;

    const response = await fetch(backendUrl, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      console.error('🔗 [Proxy] Backend error:', {
        url,
        status: response.status,
        statusText: response.statusText
      });
      return NextResponse.json(
        { error: `Backend returned: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get content type from backend response
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Get the file buffer
    const buffer = await response.arrayBuffer();

    // Return with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('🔗 [Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy file' },
      { status: 500 }
    );
  }
}
