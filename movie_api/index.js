// imported modules
const express = require('express');
  uuid = require('uuid');
  morgan = require('morgan');
  bodyParser = require('body-parser');

const app = express();

// importing mongoose database
const mongoose = require('mongoose');
const Models = require('./models.js');

const movies = Models.movie;
const users = Models.user;

mongoose.connect('mongodb://localhost:27017/DeppFlix', { useNewUrlParser: true, useUnifiedTopology: true });

// middleware
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// GET requests
// Welcome page
app.get("/", (req, res) => {
  res.send("Welcome to DeppFlix!");
});

// GET All users
app.get("/users", passport.authenticate('jwt', {session: false}), (req, res) => {
	users.find()
		.then((users) => {
			res.status(201).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// GET user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// GET All movies
app.get("/movies", passport.authenticate('jwt', {session: false}), (req, res) => {
	movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// GET data about a single movie by title
app.get("/movies/:Title", passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({ Title: req.params.Title })
	.then((movie) => {
		res.json(movie);
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error:  ' + err);
	});
});

// GET data about a specific genre by name ("Horror")
app.get("/movies/genre/:Name", passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({ 'Genre.Name': req.params.Name })
	.then((movies) => {
	    if (movies.Genre) {
	      res.status(200).json(movies.Genre);
	    } else {
	      res.status(404).send("Invalid Genre");
	    }
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	}); 
}); 

// GET data about a specific director by name
app.get("/movies/director/:Name", passport.authenticate('jwt', {session: false}), (req, res) => {
  movies.findOne({ 'Director.Name': req.params.Name })
	.then((movies) => {
	    if (movies.Director) {
	      res.status(200).json(movies.Director);
	    } else {
	      res.status(404).send("Invalid Director");
	    }
	})
	.catch((err) => {
		console.error(err);
		res.status(500).send('Error: ' + err);
	}); 
}); 

/* ADD data for new user to list of users
JSON format:

{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  DOB: Date
} */

app.post('/users', (req, res) => {
  users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            DOB: req.body.DOB
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// DELETE a user by username
app.delete("/users/:Username", passport.authenticate('jwt', {session: false}), (req, res) => {
	users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(400).send(req.params.Username + ' does not exist.');
			} else {
				res.status(200).send(req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

/* PUT allow users to update their info by username
JSON format:

{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  DOB: Date
} */

app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      DOB: req.body.DOB
    }
  },
  { new: true }, // making sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
  });
});

// ADD movie to favourites by ID
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
 users.findOneAndUpdate({ Username: req.params.Username }, {
	 $push: { FavouriteMovies: req.params.MovieID }
 	}, 
	{ new: true }, // making sure the updated document is returned)
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error ' + err);
		} else {
			res.json(updatedUser);
		}
	});
});

// DELETE movie from favourites by ID
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
 users.findOneAndUpdate({ Username: req.params.Username }, {
	 $pull: { FavouriteMovies: req.params.MovieID }
 	}, 
	{ new: true }, // making sure the updated document is returned)
	(err, updatedUser) => {
		if (err) {
			console.error(err);
			res.status(500).send('Error ' + err);
		} else {
			res.json(updatedUser);
		}
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