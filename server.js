const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const notesFilePath = path.join(__dirname, 'db', 'notes.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/api/notes', (req, res) => {
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data. Please try again later.' });
      }
  
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
  
    if (!title || !text) {
      return res.status(400).json({ error: 'Title and text are required fields.' });
    }
  
    fs.readFile(notesFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes data. Please try again later.' });
      }
  
      const notes = JSON.parse(data);
    const newNote = {
      title,
      text,
      id: Date.now() + Math.floor(Math.random() * 1000), 
    };
    notes.push(newNote);

    fs.writeFile(notesFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save the note. Please try again later.' });
      }

      res.json(newNote);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});