// imported modules
const express = require('express');
  morgan = require('morgan');


const app = express();

// middleware
app.use(morgan('common'));
app.use(express.static('public'));

// movie object
let topMovies = [
  {
    title: 'PofC: On Stranger Tides',
    director: 'Rob Marshall'
  },
  {
    title: 'Charlie and the Chocolate Factory',
    director: 'Tim Burton'
  },
  {
    title: 'PofC: Dead Man\'s Chest',
    director: 'Gore Verbinski'
  },
  {
    title: 'Platoon',
    director: 'Oliver Stone '
  },
  {
    title: 'Donnie Brasco',
    director: 'Mike Newell'
  },
  {
    title: 'Alice in Wonderland ',
    director: 'Tim Burton'
  },
  {
    title: 'Public Enemies',
    director: 'Michael Mann'
  },
  {
    title: 'A Nightmare on Elm Street',
    director: 'Wes Craven'
  },
  {
    title: 'Fear and Loathing in Las Vegas',
    director: 'Terry Gilliam'
  },
  {
    title: 'Cry-Baby',
    director: 'John Waters'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to DeppFlix!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});