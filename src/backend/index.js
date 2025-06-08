// GET /film ; POST /note ; GET /note/:id

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data', 'films.json');

let films = [];

try {
  const data = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(data);
  films = jsonData.film; 
} catch (err) {
  console.error('Erreur lecture fichier films.json :', err);
}

let notes = {}; 

// GET /film 
app.get('/film', (req, res) => {
  if (films.length === 0) return res.status(500).send('Aucun film disponible.');
  const film = films[Math.floor(Math.random() * films.length)];
  res.json(film);
});

// POST /note 
app.post('/note', (req, res) => {
  const { id, note } = req.body;
  if (!id || typeof note !== 'number' || note < 1 || note > 5) {
    return res.status(400).send('Requête invalide');
  }

  if (!notes[id]) {
    notes[id] = [];
  }

  notes[id].push(note);
  res.send('Note enregistrée');
});

// GET /note/:id : 
app.get('/note/:id', (req, res) => {
  const id = req.params.id;
  if (!notes[id] || notes[id].length === 0) {
    return res.json({ moyenne: 0 });
  }

  const moyenne =
    notes[id].reduce((a, b) => a + b, 0) / notes[id].length;

  res.json({ moyenne: moyenne.toFixed(2) });
});

app.listen(3000, () => {
  console.log('Backend lancé sur le port 3000');
});