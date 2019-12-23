const request = require('request');


const fetchMovies = (searchTerm,showMovies)=>{
        const url = "http://www.omdbapi.com";
        const qs = { 
                apikey:"aa301eaf",
                s:searchTerm
        }
        request({url,qs,json:true},(error,response)=>{
                if(error){
                        showMovies(error,undefined)
                }else{
                        showMovies(undefined,response.body.Search)
                }
        })
}


const fetchMovieDetails = (searchId,showMovieDetails)=>{
        
        const url ="http://www.omdbapi.com";
        const qs ={
                apikey: "aa301eaf",
                i:searchId
        }
        request({url,qs,json:true},(error,response)=>{
                if(error) showMovieDetails(error, undefined);
                else {
                       
                        showMovieDetails(undefined,response);
                }
                
        })
}

module.exports = {
        fetchMovies,
        fetchMovieDetails
}