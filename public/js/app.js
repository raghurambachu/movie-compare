const  fetchMovies = (inputDOM,onGettingMovies) =>{
       
        inputDOM.addEventListener('input',debounce(async ()=>{
                let listofmovies =""
                       const searchTerm =  inputDOM.value;
                       const moviesData = await axios("/listmovies",{
                               params:{
                                       searchTerm
                               }
                       })

                       if(!moviesData.data.movies.length){
                               listofmovies = []
                       }else{
                                listofmovies = moviesData.data.movies
                       }

                       onGettingMovies(listofmovies) 
        }))
}

const fetchMovieDetails = async (movieId,onGettingMovieDetails)=>{
        const movieDetailsData = await axios("/moviedetails",{
                params:{
                        movieId
                }
        })
        const movieDetails = movieDetailsData.data.body
        onGettingMovieDetails(movieDetails)
}

const buildMovieTemplate = (movieDetails,summaryDOM,side)=>{

        const image = movieDetails.Poster ==="N/A"? "https://via.placeholder.com/150":movieDetails.Poster

        const awards = movieDetails.Awards.split(" ").reduce((prev,curr)=>{
                if(isNaN(parseInt(curr)))
                        return prev;
                else
                        return prev + parseInt(curr)
        },0) 

        let boxOffice = movieDetails.BoxOffice.replace(/\$/,"").split(",").join('') 
        boxOffice = !isNaN(parseInt(boxOffice)) ? boxOffice : 0


        let metaScore = movieDetails.Metascore !== "N/A" ? parseInt(movieDetails.Metascore): 0

        let votes = movieDetails.imdbVotes  !== "N/A" ? movieDetails.imdbVotes.split(",").join(""):0

        summaryDOM.innerHTML = `
                <div class="summary">
                        <div class="main-summary">
                                <div class="image">
                                        <img src="${image}">
                                </div>
                                <div class="image-description">
                                        <h3>${movieDetails.Title}</h3>
                                        <p><strong>Released : </strong>${movieDetails.Released}<p>
                                        <p><strong>Run Time : </strong>${movieDetails.Runtime}<p>
                                        <p><strong>Plot:</strong> ${movieDetails.Plot}</p>
                                </div>
                        </div>
                        <div class="stat-summary">
                                <article data-value="${awards}" class="is-primary notification">
                                        <p class="title">${movieDetails.Awards ? movieDetails.Awards:"N/A"}</p>
                                        <p class="subtitle">Awards</p>
                                </article>
                                <article data-value="${boxOffice}"class="is-primary notification">
                                        <p class="title">${movieDetails.BoxOffice ? movieDetails.BoxOffice: "N/A"}</p>
                                        <p class="subtitle">Box Office</p>
                                </article>
                                <article data-value="${metaScore}" class="is-primary notification">
                                        <p class="title">${movieDetails.Metascore ? movieDetails.Metascore:"N/A" }</p>
                                        <p class="subtitle">Metascore</p>
                                </article>      
                                <article data-value="${votes}" class="is-primary notification">
                                        <p class="title">${movieDetails.imdbVotes ? movieDetails.imdbVotes : "N/A" }</p>
                                        <p class="subtitle">IMDB Votes</p>
                                  </article>
                                  <article  class="is-primary notification">
                                        <p class="title">${movieDetails.imbdRating ? movieDetails.imbdRating : "N/A"}</p>
                                        <p class="subtitle">IMDB Rating</p>
                                 </article>
                        </div>
                </div>
        `
        

        const leftSide = document.querySelectorAll("#left-summary article");
        const rightSide = document.querySelectorAll("#right-summary article");
    
        if(leftSide.length && rightSide.length){

 
                leftSide.forEach((leftSideArticle,index)=>{
                        
                         const leftSideValue = leftSideArticle.dataset.value;
                        const rightSideArticle = rightSide[index];
                        const rightSideValue = rightSideArticle.dataset.value
                        if(rightSideValue >leftSideValue){
                                leftSideArticle.classList.remove("is-primary");
                                leftSideArticle.classList.add("is-warning")
                        }else if(leftSideValue > rightSideValue){
                                rightSideArticle.classList.remove("is-primary");
                                rightSideArticle.classList.add("is-warning")
                        }else{
                              
                        }
                })
        }

}

createAutoCompleteConfig = {
        fetchData(inputDOM,returned){ 
                fetchMovies(inputDOM,(movies)=>{
                        returned(movies)
                })  
       },
       displayList(movie,resultDOM){
               //console.log(movie)
               const moviePoster = movie.Poster === "N/A" ? "https://via.placeholder.com/150" : movie.Poster
               resultDOM.innerHTML += `
                       <a class="dropdown-item items" href="#" >
                               <img class="list-img" src="${moviePoster}">
                               <div id="${movie.imdbID}"> ${movie.Title}</div>
                               (${movie.Year})
                       </a>
               `
               return;
       }

}



createAutoComplete({
        ...createAutoCompleteConfig,
        root: document.querySelector('#left-autocomplete'),
        fetchDetails(option){
                const movie = option
                const movieId = movie.getAttribute('id')
                
                fetchMovieDetails(movieId,(movieDetails)=>{
                        buildMovieTemplate(movieDetails,document.querySelector("#left-summary"),"left")
                })
        }
})

createAutoComplete({
        ...createAutoCompleteConfig,
        root: document.querySelector('#right-autocomplete'),
        fetchDetails(option){
                const movie = option
                const movieId = movie.getAttribute('id')
                
                fetchMovieDetails(movieId,(movieDetails)=>{
                        buildMovieTemplate(movieDetails,document.querySelector("#right-summary"),"right")
                })
        }
        
})


