// imported modules
const express = require('express');
  uuid = require('uuid');
  morgan = require('morgan');
  bodyParser = require('body-parser');

const app = express();

// middleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'));

// movie objects
let movies = [
  {
    title: 'PotC: On Stranger Tides',
    genre: {
      name: 'Adventure',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Rob Marshall',
      dob: '01.01.1975'
  }},
  {
    title: 'Charlie and the Chocolate Factorys',
    genre: {
      name: 'Comedy',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Tim Burton',
      dob: '01.01.1975'
  }},
  {
    title: 'PotC: Dead Man\'s Chest',
    genre: {
      name: 'Adventure',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Gore Verbinski',
      dob: '01.01.1975'
  }},
  {
    title: 'Platoon',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you!'
    },
    director: {
      name: 'Oliver Stone',
      dob: '01.01.1975'
  }},
  {
    title: 'Donnie Brasco',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you!'
    },
    director: {
      name: 'Mike Newell',
      dob: '01.01.1975'
  }},
  {
    title: 'Alice in Wonderland',
    genre: {
      name: 'Fantasy',
      description: 'The most creative genres of all! Fun for a wide audience.'
    },
    director: {
      name: 'Tim Burton',
      dob: '01.01.1975'
  }},
  {
    title: 'Public Enemies',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you.'
    },
    director: {
      name: 'Michael Mann',
      dob: '01.01.1975'
  }},
  {
    title: 'A Nightmare on Elm Street',
    genre: {
      name: 'Horror',
      description: 'You like to be scared? This is the right genre for you'
    },
    director: {
      name: 'Wes Craven',
      dob: '01.01.1975'
  }},
  {
    title: 'Fear and Loathing in Las Vegas',
    genre: {
      name: 'Adventure',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Terry Gillia',
      dob: '01.01.1975'
  }},
  {
    title: 'Cry-Baby',
    genre: {
      name: 'Comedy',
      description: 'Need a bit of a laugh? Then this genre is perfect for you'
    },
    director: {
      name: 'John Watersa',
      dob: '01.01.1975'
  }}
];

let users = [
  {
    name: 'user1',
    favourites: [],
    id: '1'
  }
]

// GET requests
// Welcome page
app.get('/', (req, res) => {
  res.send('Welcome to DeppFlix!');
});

// All movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// All users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET data about a single movie by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
  { return movie.title === req.params.title}));
});

// GET data about a specific genre by name ("Horror") -- doesn't work
app.get('/movies/genre/:genreName', (req, res) => {
  res.json(movies.find((genreName) => {
    return genreName === req.params.name}));s
});

// ADD data for new user to list of users
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status (201).send(newUser);
  }
});

// DELETE a user by id -- doesn't work
app.delete('/users/:Username', (req, res) => {
  let user = user.find((user) => {
    return user.id === req.params.id });

    if (user) {
      users = users.filter((obj) => { return obj.id !== req.params.id });
      res.status(201).send('User ' + req.params.id + ' was deleted.');
    }
});

// UPDATE data of a user (username) -- doesn't work
app.put('/users/:id/:username', (req, res) => {
  let user = users.find((user) => {
    return user.name === req.params.name });

    if (user) {
      user.info[req.params.info] = parseInt(req.params.username);
      res.status(201).send('User ' + req.params.name + ' was assigned the new username ' + req.params.username);
    } else {
      res.status(404).send('User ' + req.params.name + ' was not found.');
    }
});

// PUT: allow users to update their user info -- doesn't work
app.put('/users/:Username', (req, res) => {
    users.findOneAndUpdate(Username === req.params.Username)},
      {Username: req.body.Username}
);

// ADD movie to favourites -- doesn't work
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    favoriteMovies.push: { favoriteMovies: req.params.MovieID }
  });
});

// DELETE movie from favourites -- doesn't work
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, {
    favoriteMovies.pull: { favoriteMovies: req.params.MovieID }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});