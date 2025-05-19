const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/downloads', express.static('/tmp'));

app.post('/api/convert', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  const id = uuidv4();
  const dir = path.join('/tmp', id);
  fs.mkdirSync(dir, { recursive: true });

  const command = `yt-dlp -x --audio-format mp3 -o '${dir}/%(title)s.%(ext)s' ${url}`;
  exec(command, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur téléchargement' });

    const zip = `/tmp/${id}.zip`;
    exec(`zip -j ${zip} ${dir}/*.mp3`, (zipErr) => {
      if (zipErr) return res.status(500).json({ error: 'Erreur compression' });

      res.json({ downloadLink: `https://youtube-mp3-api.onrender.com/downloads/${id}.zip` });
    });
  });
});

app.listen(PORT, () => console.log(`✅ Backend démarré sur le port ${PORT}`));