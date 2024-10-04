'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [blob, setBlob] = useState('')
  const [info, setInfo] = useState({ title: 'default' })

  const fetchData = async () => {
    setError('')

    const response = await fetch(`/api?url=${encodeURIComponent(url)}`)
    const resTwo = await fetch(`/api/deux?url=${encodeURIComponent(url)}`)

    if (resTwo.ok) {
      const data = await resTwo.json()
      setInfo(data)
    }

    if (response.ok) {
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      setBlob(downloadUrl)
    } else {
      const errorData = await response.json()
      setError(errorData.error || `Erreur lors du téléchargement de l'audio`)
    }
  }

  const handleDownload = () => {
    if (info) {
      const title = info?.title as string
      const a = document.createElement('a')
      a.href = blob
      a.download = title
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blob)
    }
  }

  return (
    <div style={{ padding: '20px', border: "3px solid lightgray" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>

        <h1>YouTube Audio Downloader</h1>

        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '10px', width: '100%' }}
        />

        <button
          onClick={fetchData}
          style={{ padding: '10px', width: '100%' }}
        >
          Seek
        </button>

        <button
          disabled={blob === ''}
          onClick={handleDownload}
          style={{ padding: '10px', width: '100%' }}
        >
          Download
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
