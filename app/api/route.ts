import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

interface ErrorResponse {
  error: string;
}

export async function GET() {
  // const { searchParams } = new URL(req.url);
  // const url = searchParams.get('url');

  const url = "https://www.youtube.com/watch?v=-08VHe0-gks"

  if (!url) {
    return NextResponse.json<ErrorResponse>({ error: 'URL manquante' }, { status: 400 });
  }

  try {
    const isValid = ytdl.validateURL(url);
    if (!isValid) {
      return NextResponse.json<ErrorResponse>({ error: 'URL YouTube non valide' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url);

    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

    let mimeType = 'audio/mpeg';
    if (audioFormat.container === 'webm') {
      mimeType = 'audio/webm';
    } else if (audioFormat.container === 'mp4') {
      mimeType = 'audio/mp4';
      // @ts-expect-error tototot
    } else if (audioFormat.container === 'ogg') {
      mimeType = 'audio/ogg';
    }

    const filename = `${info.videoDetails.title}.${audioFormat.container}`;

    const response = NextResponse.json({ error: 'Stream audio' }, { status: 200 });
    response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    response.headers.set('Content-Type', mimeType);

    const audioStream = ytdl(url, { format: audioFormat });

    // @ts-expect-error yoyoyo
    return new Response(audioStream, {
      headers: response.headers,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ error: 'Erreur lors du téléchargement de la vidéo' }, { status: 500 });
  }
}
