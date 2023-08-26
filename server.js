const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '../db/db.json'));
});

app.post('/api/notes', (req, res) => {
let db = fs.readFileSync(path.join(__dirname, '../db/db.json'));
db = JSON.parse(db);
let newNote = {
  title: req.body.title,
  text: req.body.text,
  id: db.length + 1
}
db.push(newNote);
fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(db));
res.json(db);
});

app.delete('/api/notes/:id', (req, res) => {
  let db = fs.readFileSync(path.join(__dirname, '../db/db.json'));
 let deleteNote = db.filter(note => note.id != req.params.id);
  fs.writeFileSync(path.join(__dirname, '../db/db.json'), JSON.stringify(deleteNote));
  res.json(deleteNote);
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
