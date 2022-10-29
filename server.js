const express = require('express');
let dbNotes = require('./Develop/db/db.json');
const fs = require("fs");
const path = require('path');
var uniqid = require("uniqid");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/api/notes', (req, res) => {
    console.log(dbNotes);
    res.json(dbNotes);
    console.info(`${req.method} request received to get reviews`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    const { title, text} = req.body;
    if (title && text) {
      const newNotesEntry = {
        title,
        text,
        id: uniqid(),
      };
  
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNewNotes = JSON.parse(data);
          parsedNewNotes.push(newNotesEntry);
          dbNotes =  parsedNewNotes;

          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNewNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
    });
               
      const response = {
        status: 'success',
        body: newNotesEntry,
      };
  
      console.log(response);
      res.json(response);
    } else {
      res.json('Error in posting review');
    }
  });

app.delete("/api/notes/:id", (req, res) => { 
  let response = fs.readFileSync('./db/db.json', 'utf8');
  const responseJSON = JSON.parse(response)

  const sideEnteredNotes = responseJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  
  fs.writeFile( "./db/db.json",JSON.stringify(sideEnteredNotes),(err, text) => {
      if (err) {
        console.error(err);
        return;
      }
    });

  res.json(sideEnteredNotes);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);


