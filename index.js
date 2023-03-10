require('dotenv').config(); //needed for env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//let password = '3nFmlSNQl6AsLKIC';
const Note = require('./models/note');

/* let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-05-30T17:30:31.098Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only Javascript',
    date: '2022-05-30T18:39:34.091Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-05-30T19:20:14.298Z',
    important: true,
  },
]; */

const cors = require('cors');
app.use(cors());

app.use(express.static('build'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello, world!</h1>');
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  //console.log(request.headers);
  const body = request.body;
  if (!body.content) {
    return response.status(404).json({
      error: 'content missing',
    });
  }
  const note = new Note({
    //id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get('/api/notes/', (request, response) => {
  /* let id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => note.id === id);
  console.log(note);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  } */
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
