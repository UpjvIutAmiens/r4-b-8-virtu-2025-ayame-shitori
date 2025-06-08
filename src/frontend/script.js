let currentFilmId = null;

async function loadRandomFilm() {
  try {
    const res = await fetch('/film');
    if (!res.ok) throw new Error('Erreur chargement film');
    const film = await res.json();

    currentFilmId = film.id || film.id; 

    document.getElementById('title').textContent = film.titre || film.title || "Titre inconnu";
    document.getElementById('description').textContent = film.description || "Pas de description";
    document.getElementById('poster').src = film.affiche || film.poster || '';
    document.getElementById('genre').textContent = film.genre || "Genre inconnu";

    loadAverageNote(currentFilmId);
  } catch (err) {
    console.error(err);
  }
}

async function sendNote(note) {
  if (!currentFilmId) return;
  try {
    const res = await fetch('/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: currentFilmId, note })
    });
    if (!res.ok) throw new Error('Erreur envoi note');
    loadAverageNote(currentFilmId);
  } catch (err) {
    console.error(err);
  }
}

async function loadAverageNote(id) {
  try {
    const res = await fetch(`/note/${id}`);
    if (!res.ok) throw new Error('Erreur chargement notes');
    const data = await res.json();
    document.getElementById('average-note').textContent =
      data.moyenne && data.moyenne !== "0"
        ? `Note moyenne : ${data.moyenne}`
        : "Pas encore de note";
  } catch (err) {
    console.error(err);
  }
}

document.querySelectorAll('#note-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    const note = parseInt(button.dataset.note, 10);
    sendNote(note);
  });
});


loadRandomFilm();
