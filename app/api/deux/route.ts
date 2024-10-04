import { NextResponse } from 'next/server'
import ytdl from '@distube/ytdl-core'

interface ErrorResponse {
  error: string
}

interface VideoInfoResponse {
  title: string
  author: string
  duration: string
  thumbnail: string
  mimeType: string
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

    const info = await ytdl.getInfo(url, { agent })

    // Retourne les informations sur la vidéo
    const videoInfo: VideoInfoResponse = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: `${info.videoDetails.lengthSeconds} seconds`,
      thumbnail: info.videoDetails.thumbnails[0].url,
      mimeType: 'audio/mp4'
    }

    return NextResponse.json(videoInfo, { status: 200 })

  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      { error: `Erreur lors de la récupération des informations: ${error}` },
      { status: 500 }
    )
  }
}
