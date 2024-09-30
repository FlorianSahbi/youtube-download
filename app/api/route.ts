import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

interface ErrorResponse {
  error: string;
}

export async function GET() {
  // const { searchParams } = new URL(req.url);
  // const url = searchParams.get('url');

  const url = "https://www.youtube.com/watch?v=-08VHe0-gks"

  const cookies = [
    { name: "__Secure-3PSID", value: "g.a000oQiZqZ8uh2Td1TZhwgsN3zpnSWzhBR-aF1E7oZYqMUmxTZrOaAPLuWoTsbjLsLJIO2nWYwACgYKAbkSARESFQHGX2Mi4_Y08JXE6VW8xirfcKGEwxoVAUF8yKpRmOnTgp_mQUrOD1C44a0D0076" },
    { name: "GPS", value: "1" },
    { name: "__Secure-1PSIDTS", value: "sidts-CjEBQlrA-DPiZpMS-whJO8K8ZEjdpn7J1lg4wah0Pd4uEablC9uY1yhKW4fvHhu7nisuEAA" },
    { name: "__Secure-3PAPISID", value: "4WtY8_ZIhlJ5yEZH/ASIO6dHRujyShVJhx" },
    { name: "__Secure-3PSIDCC", value: "AKEyXzU_I_fv-dc0tcizUoLOuySVXDnf4VQxuPShHYXn867SwOWDXTXn6YbNemPFFe8_6-ZG" },
    { name: "__Secure-3PSIDTS", value: "sidts-CjEBQlrA-DPiZpMS-whJO8K8ZEjdpn7J1lg4wah0Pd4uEablC9uY1yhKW4fvHhu7nisuEAA" },
    { name: "LOGIN_INFO", value: "AFmmF2swRAIgBclNKixxUXeWnq_sVvYgQGJPOtfuNqt4X_jiynPhC1oCIBJVWrFQLHE1AyPP5kQ3arRhDcrahH0ASa59w2y174zb:QUQ3MjNmenVSZ1BUZXo5clVmb0V0LVF3ZXlvOFpXT2J4ZUNmOG5oRzZxSHNWcmpKdXJZd0l3M3ZIVHctNlBpWEI2SGRtQnVubnV6d2hlcU9iOGI5TkdLUkFjaTlBcm5obFNJeS1rSUFHY1JhdlNXWFlnYm4zTXIzam04V0VUQUt4aVRYbTdPeUVHNTFnVEpCMFZOaGNuUS1yOTYxbFZjRlFB" },
    { name: "PREF", value: "tz=Asia.Tokyo&f4=4000000&f6=40000000&f5=30000&f7=100" },
  ];

  const agentOptions = {
    pipelining: 5,
    maxRedirections: 0,
    localAddress: "127.0.0.1",
  };

  const agent = ytdl.createAgent(cookies, agentOptions);



  if (!url) {
    return NextResponse.json<ErrorResponse>({ error: 'URL manquante' }, { status: 400 });
  }

  try {
    const isValid = ytdl.validateURL(url);
    if (!isValid) {
      return NextResponse.json<ErrorResponse>({ error: 'URL YouTube non valide' }, { status: 400 });
    }

    const info = await ytdl.getInfo(url, { agent });

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

    const audioStream = ytdl(url, { format: audioFormat, agent });

    // @ts-expect-error yoyoyo
    return new Response(audioStream, {
      headers: response.headers,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json<ErrorResponse>({ error: 'Erreur lors du téléchargement de la vidéo' }, { status: 500 });
  }
}
