// imported modules
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/DeppFlix', { useNewUrlParser: true, useUnifiedTopology: true });

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
      birth: '1960'
  }},
  {
    title: 'Charlie and the Chocolate Factory',
    genre: {
      name: 'Comedy',
      description: 'Need a bit of a laugh? Then this genre is perfect for you'
    },
    director: {
      name: 'Tim Burton',
      birth: '1958'
  }},
  {
    title: 'PotC: Dead Man\'s Chest',
    genre: {
      name: 'Adventure',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Gore Verbinski',
      birth: '1964'
  }},
  {
    title: 'Platoon',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you!'
    },
    director: {
      name: 'Oliver Stone',
      birth: '1946'
  }},
  {
    title: 'Donnie Brasco',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you!'
    },
    director: {
      name: 'Mike Newell',
      birth: '1942'
  }},
  {
    title: 'Alice in Wonderland',
    genre: {
      name: 'Fantasy',
      description: 'The most creative genres of all! Fun for a wide audience.'
    },
    director: {
      name: 'Tim Burton',
      birth: '1958'
  }},
  {
    title: 'Public Enemies',
    genre: {
      name: 'Drama',
      description: 'If you like drama, here is all of it for you.'
    },
    director: {
      name: 'Michael Mann',
      birth: '1943'
  }},
  {
    title: 'A Nightmare on Elm Street',
    genre: {
      name: 'Horror',
      description: 'You like to be scared? This is the right genre for you'
    },
    director: {
      name: 'Wes Craven',
      birth: '1939'
  }},
  {
    title: 'Fear and Loathing in Las Vegas',
    genre: {
      name: 'Adventure',
      description: 'Epic quests and breath-taking scenery.. Adventure movies are well-rounded'
    },
    director: {
      name: 'Terry Gilliam',
      birth: '1940'
  }},
  {
    title: 'Cry-Baby',
    genre: {
      name: 'Comedy',
      description: 'Need a bit of a laugh? Then this genre is perfect for you'
    },
    director: {
      name: 'John Waters',
      birth: '1946'
  }}
];

let users = [
  {
    name: 'user1',
    favourites: ["Platoon"],
    id: '1'
  }
]

// GET requests
// Welcome page
app.get("/", (req, res) => {
  res.send("Welcome to DeppFlix!");
});

// All movies
app.get("/movies", (req, res) => {
  res.json(movies);
});

// All users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET data about a single movie by title
app.get("/movies/:title", (req, res) => {
  res.json(movies.find((movie) =>
  { return movie.title === req.params.title}));
});

// GET data about a specific genre by name ("Horror")
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find(
    (movie) => movie.genre.name.toLowerCase() === genreName.toLowerCase()
  );

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).send("Invalid Genre");
  }
});

// GET data about a specific director by name
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.director.name.toLowerCase() === directorName.toLowerCase()
  );

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).send("Director does not exist");
  }
});

// ADD data for new user to list of users
app.post("/users", (req, res) => {
  const newUser = req.body;

  if (!newUser.name) {
    const message = "Missing name in request body";
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status (201).send(newUser);
  }
});

// DELETE a user by id
app.delete("/users/:Username", (req, res) => {
  const { Username } = req.params;
  const user = users.find((user) => {
    return user.name === req.params.Username;
  });

  if (user) {
    res.status(200).send(`${Username} has been deleted.`);
  } else {
    res.status(400).send("No User Found");
  }
});

// PUT allow users to update their user info
app.put("/users/:Username", (req, res) => {
  const { Username } = req.params;
  const updatedUser = req.body;
  const user = users.find((user) => user.name === Username);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user.name);
  } else {
    res.status(400).send("No User Found");
  }
});


// ADD movie to favourites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
  const { Username, MovieID } = req.params;

  const user = users.find((user) => user.name === Username);

  if (user) {
    user.favourites.push(MovieID);
    res
      .status(200)
      .send(`${MovieID} has been added to ${Username}'s favorites.`);
  } else {
    res.status(400).send("No User Found");
  }
});

// DELETE movie from favourites
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
  const { Username, MovieID } = req.params;

  const user = users.find((user) => user.name === Username);

  if (user) {
    user.favourites = user.favourites.filter((title) => title === MovieID);
    res
      .status(200)
      .send(`${MovieID} has been deleted from user ${Username}'s favorites.`);
  } else {
    res.status(400).send("No User Found");
  }
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