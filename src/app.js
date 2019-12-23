const express =require('express');
const path = require('path')
const hbs = require('hbs')
const utils = require('./utils/utils.js')

const app = express();
const port = process.env.PORT || 3000 ;

const publicPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.use(express.static(publicPath));

app.set("view engine","hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialsPath)

app.get('/',(req,res)=>{
        res.render("index")
})


app.get("/listmovies",(req,res)=>{
        const searchTerm = req.query.searchTerm;
                utils.fetchMovies(searchTerm,(error,movies)=>{
                        if(error) res.send({error})
                        else {
                                if(movies){
                                        res.send({movies})
                                }else{
                                        movies = []
                                        res.send({movies})
                                }
                        }
        })
})

app.get("/moviedetails",(req,res)=>{
        const movieId = req.query.movieId;
        utils.fetchMovieDetails(movieId,(error,movieDetails)=>{
                if(error) res.send(error)
                res.send(movieDetails)
              
        })
})







app.listen(port,()=>{
        console.log("Server started at Port : ",port)
})



