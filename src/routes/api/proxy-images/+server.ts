import { promises as fs } from 'fs';
import path from 'path';

export const GET = async ({ url }) => {
  const imageUrl = url.searchParams.get('url');
  if (!imageUrl) {
    return new Response('Missing URL', { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=604800',
      },
    });
  } catch (error) {
    const filePath = path.resolve('static', 'default-profile.jpg');

    try {
      const defaultProfileImage = await fs.readFile(filePath);

      return new Response(defaultProfileImage as unknown as ArrayBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
    } catch (e) {
      return new Response('File Not Found!', {
        status: 404,
      });
    }
  }
};
