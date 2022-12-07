


const { sortBy } = require("underscore");
const { Movie } = require("./server");
// require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())
app.use(express.urlencoded({ 'extended': 'true' }))

const posts = [
	{
		username: 'admin',
		title: 'webAdmin'
	},
	{
		username: 'nadmin',
		title: 'netAdmin'
	}
]

exports.login = (req, res) => {
	console.log(req)
	//Authenticated User
	const username = req.body.username
	const user = { name: username }
	const accessToken = jwt.sign(user, process.env.SECRETKEY)
	res.json({ accessToken: accessToken })
};
function verifyToken(req, res, next) {
	console.log("in verify .................")
	const bearerHeadr = req.headers['authorization']
	if (typeof bearerHeadr != 'undefined') {
		const bearer = bearerHeadr.split(' ')
		const bearerToken = bearer[1]
		req.token = bearerToken
		next()
	}
	else
	{
		console.log("in verify else .................")

		res.sendStatus(403)
	}
}
const getPagination = (page, size) => {
	const limit = size ? +size : 3;
	const offset = page ? page * limit : 0;

	return { limit, offset };
};



exports.getAllMovies = verifyToken, (req, res) => {
	jwt.verify(req.token, process.env.SECRETKEY, (err, decoded) => {
		if (err)
			//res.status(403).send("Forbidden access")
			res.sendStatus(403)
		else {
			console.log(decoded)
			//res.json(posts)
			const { page, size, title } = req.query;

			var condition = title
				? { title: { $regex: title, $options: 'i' } }
				: {};
			const { limit, offset } = getPagination(page, size);
			console.log(title + "     title")
			console.log(condition + "     size")

			Movie.paginate(condition, { select: "title", sort: { _id: 1 }, offset, limit })
				.then((data) => {
					res.send({
						totalItems: data.totalDocs,
						movies: data.docs,
						totalPages: data.totalPages,
						currentPage: data.page - 1,
					});

				})
				.catch(err => {
					res.status(500).send({
						message:
							err.message || "Some error occurred while retrieving tutorials."
					});
				});
		}
	});

};



exports.getform = (req, res, next) => {
	res.render('movieform', { title: 'Get movie Form' });
};



exports.getAllMoviesUsingparams = (req, res) => {
	const { page, size, title } = req.query;

	var condition = title
		? { title: { $regex: title, $options: 'i' } }
		: {};
	const { limit, offset } = getPagination(page, size);
	console.log(title + "     title")
	console.log(condition + "     size")

	Movie.paginate(condition, { select: "title", sort: { _id: 1 }, offset, limit })
		.then((data) => {

			res.render('allMovies', { title: 'Success', message: data.docs });

		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving tutorials."
			});
		});
};


exports.addmovie = (req, res) => {
	// Validate request
	if (!req.body.title) {
		res.status(400).send({ message: "Content can not be empty!" });
		return;
	}

	// Create a movie
	const movie = new Movie({

		plot: req.body.plot,
		genres: req.body.genres,
		runtime: req.body.runtime,
		cast: req.body.cast,
		num_mflix_comments: req.body.num_mflix_comments,
		title: req.body.title,
		fullplot: req.body.fullplot,
		countries: req.body.countries,
		released: req.body.released,
		directors: req.body.directors,
		rated: req.body.rated,
		awards: req.body.awards,
		lastupdated: req.body.lastupdated,
		year: req.body.year,
		imdb: req.body.imdb,
		type: req.body.type,
		tomatoes: req.body.tomatoes
	});

	// Save movie in the database
	movie
		.save(movie)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the movie."
			});
		});
};


exports.findOne = verifyToken,(req, res) => {
	const id = req.params.id;

	Movie.findById(id)
		.then(data => {
			if (!data)
				res.status(404).send({ message: "Not found movie with id " + id });
			else res.send(data);
		})
		.catch(err => {
			res
				.status(500)
				.send({ message: "Error retrieving movie with id=" + id });
		});
};


exports.findAll = (req, res) => {
	Movie.find({}).lean().exec(function (err, movies) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		// return all employees in JSON format
		console.log(movies);

		res.json(movies);
	});
};


exports.update = (data, id, res) => {


	Movie.findByIdAndUpdate(id, data, function (err, data) {
		if (err) throw err;

		res.send('Successfully! data updated - ' + data.title);
	});
}

exports.delete = (id, res) => {
	Movie.deleteOne({
		_id: id
	}, function (err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Id  has been Deleted.');
	});
}

exports.getOneId = (id, res) => {
	Movie.findById(id, function (err, res1) {
		if (err) {
			res.send(err)
		}
		res.json(res1)
	})
}
