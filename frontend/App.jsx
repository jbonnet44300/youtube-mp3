import { useState, useEffect } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleSubmit = async () => {
    if (!url) {
      setStatus('Merci de coller une URL');
      return;
    }

    setStatus('Connexion au serveur...');
    setIsLoading(true);
    setProgress(10);

    try {
      const res = await fetch('https://youtube-mp3-api.onrender.com/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      setProgress(50);
      setStatus('Conversion en cours...');

      const json = await res.json();

      if (json.downloadLink) {
        setProgress(100);
        setStatus('Conversion terminée ! Fichiers prêts à télécharger.');
        setDownloadLink(json.downloadLink);
      } else {
        throw new Error('Lien de téléchargement non fourni');
      }
    } catch (err) {
      setStatus("Erreur lors de la conversion. Vérifie l'URL ou réessaie plus tard.");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isLoading && progress < 90) {
      timer = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading, progress]);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Convertisseur Playlist YouTube en MP3</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL de playlist YouTube"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button onClick={handleSubmit} style={{ padding: '0.5rem 1rem' }}>
        Convertir
      </button>

      {status && (
        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{status}</p>
      )}

      {isLoading && (
        <div style={{ marginTop: '1rem', width: '100%', background: '#eee' }}>
          <div
            style={{
              width: `${progress}%`,
              background: '#4caf50',
              color: 'white',
              padding: '0.25rem',
              textAlign: 'center',
              transition: 'width 0.5s'
            }}
          >
            {progress}%
          </div>
        </div>
      )}

      {downloadLink && (
        <a
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '1rem', color: '#2c7be5' }}
        >
          Télécharger les MP3
        </a>
      )}
    </div>
  );
}