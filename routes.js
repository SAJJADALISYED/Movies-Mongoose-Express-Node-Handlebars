module.exports = app => {
    const movies = require("./controller");

    var router = require("express").Router();
  
    router.post("/login",movies.login)
    router.post("/addmovie", movies.addmovie);
  

  
    router.get("/allform", movies.getform);
    router.get("/allmovies", movies.getAllMovies);
    router.get("/param", movies.getAllMoviesUsingparams);
    
    
   
  
     router.get("/movies/:id", movies.findOne);
  
  
    // Retrieve  -----------------------------------(Sajjad)
    router.get("/findAll", movies.findAll);
  
  
  
    // // Update with id --------------------------- (sajjad)
 
router.put('/movies/:id', function (req, res) {
  // create mongose method to update an existing record into collection
  let id = req.params.id;
	var data = {
		plot : req.body.plot,
		genres : req.body.genres,
		runtime : req.body.runtime,
		cast : req.body.cast,
		num_mflix_comments : req.body.num_mflix_comments,
		title : req.body.title,
		fullplot : req.body.fullplot,
		countries : req.body.countries,
		released : req.body.released,
		directors : req.body.directors,
		rated : req.body.rated,
		awards : req.body.awards,
		lastupdated : req.body.lastupdated,
		year : req.body.year,
		imdb : req.body.imdb,
		type : req.body.type,
		tomatoes : req.body.tomatoes
	};

  movies.update(data, id, res)


});
  
    // // Delete a Tutorial with id --------------------------- (sajjad)
    router.delete('/movies/:id', function (req, res) {
      let id = req.params.id;
      movies.delete(id, res)
  
  });
  
  
    app.use('/api', router);
app.use('/',movies.getAllMoviesUsingparams);

  };