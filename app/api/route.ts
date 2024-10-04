import { NextResponse } from 'next/server'
import ytdl from '@distube/ytdl-core'

interface ErrorResponse {
  error: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const url = searchParams.get('url')

  const agent = ytdl.createProxyAgent({ uri: "http://178.48.68.61:18080" })

  if (!url) {
    return NextResponse.json<ErrorResponse>(
      { error: 'URL manquante' },
      { status: 400 }
    )
  }

  try {
    const isValid = ytdl.validateURL(url)

    if (!isValid) {
      return NextResponse.json<ErrorResponse>(
        { error: 'URL YouTube non valide' },
        { status: 400 }
      )
    }

    const info = await ytdl.getInfo(url,
      { agent }
    )

    const audioFormat = ytdl.chooseFormat(info.formats,
      { filter: format => format.container === 'mp4', quality: 'highestaudio' }
    )



    const filename = `${info.videoDetails.title}.${audioFormat.container}`

    const response = NextResponse.json(
      { error: 'Stream audio' },
      { status: 200 }
    )

    response.headers.set('Content-Disposition', `attachment filename="${filename}"`)
    response.headers.set('Content-Type', 'audio/mp4')

    const audioStream = ytdl(url,
      { format: audioFormat, agent }
    )

    //@ts-expect-error C'est ok
    return new Response(audioStream, {
      headers: response.headers,
    })

  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      { error: `Erreur lors du téléchargement de la vidéo: ${error}` },
      { status: 500 }
    )
  }
}
