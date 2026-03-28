import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Create new FormData for backend
        const backendFormData = new FormData();
        backendFormData.append('file', file);

        const response = await fetch(`${backendUrl}/upload`, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.detail || 'Backend error' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
