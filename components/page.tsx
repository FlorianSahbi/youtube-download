'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async () => {
    const customFilename = 'mon_audio_personnalisé';

    setError('');

    const response = await fetch(`/api?url=${encodeURIComponent(url)}`);

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = customFilename + '.mp4';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Erreur lors du téléchargement de l\'audio');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>YouTube Audio Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ padding: '10px', width: '400px' }}
      />
      <button onClick={handleDownload}>
        Télécharger l'audio
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
