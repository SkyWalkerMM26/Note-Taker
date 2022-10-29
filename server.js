const express = require('express');
let dbNotes = require('./Develop/db/db.json');
const fs = require("fs");
const path = require('path');
var uniqid = require("uniqid");

//our port that we set for Heroku/ our request server.
const PORT = process.env.PORT || 3001;

const app = express();


// this is parse incoming data. the url parse data that comes from a form.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//this let's use files in our public folder.
app.use(express.static('public'));


//get requests to routes and taking the user to the set directory.
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


//get dat from api/routes website and post our data into the db.json file.
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
        //download a uniqid node module first then put it here to create id for each data object (title, text)
        id: uniqid(),
      };
  
      fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNewNotes = JSON.parse(data);
          parsedNewNotes.push(newNotesEntry);
          dbNotes =  parsedNewNotes;

          fs.writeFile(
            './Develop/db/db.json',
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

// delete data in db.json file when User wants to.
app.delete("/api/notes/:id", (req, res) => { 
  let response = fs.readFileSync('./Develop/db/db.json', 'utf8');
  const responseJSON = JSON.parse(response)

  const sideEnteredNotes = responseJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  
  fs.writeFile( "./Develop/db/db.json",JSON.stringify(sideEnteredNotes),(err, text) => {
      if (err) {
        console.error(err);
        return;
      }
    });

  res.json(sideEnteredNotes);
});

//listening to requests that goes to the PORT we have defined.
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);


