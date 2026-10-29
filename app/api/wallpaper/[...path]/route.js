import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const segments = params.path;
    if (!segments || segments.length === 0) {
      return new Response('File not found', { status: 404 });
    }

    const relativeFilePath = segments.join('/');
    const absolutePath = path.join(process.cwd(), 'collection', relativeFilePath);

    // Security check to ensure requested path stays inside collection/
    const normalized = path.normalize(absolutePath);
    if (!normalized.startsWith(path.join(process.cwd(), 'collection'))) {
      return new Response('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(normalized)) {
      return new Response('Image not found', { status: 404 });
    }

    const stat = fs.statSync(normalized);
    const fileStream = fs.createReadStream(normalized);

    const ext = path.extname(normalized).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';

    return new Response(fileStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving wallpaper image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
