const fetchMovies = (inputDOM, onGettingMovies) => {
	inputDOM.addEventListener(
		'input',
		debounce(async () => {
			let listofmovies = '';
			const searchTerm = inputDOM.value;
			const moviesData = await axios('/listmovies', {
				params: {
					searchTerm
				}
			});

			if (!moviesData.data.movies.length) {
				listofmovies = [];
			} else {
				listofmovies = moviesData.data.movies;
			}

			onGettingMovies(listofmovies);
		})
	);
};

const fetchMovieDetails = async (movieId, onGettingMovieDetails) => {
	const movieDetailsData = await axios('/moviedetails', {
		params: {
			movieId
		}
	});
	const movieDetails = movieDetailsData.data.body;
	onGettingMovieDetails(movieDetails);
};

const buildMovieTemplate = (movieDetails, summaryDOM, side) => {
	const image = movieDetails.Poster === 'N/A' ? 'https://via.placeholder.com/150' : movieDetails.Poster;

	let awards = movieDetails.Awards;
	if (awards) {
		awards = awards.split(' ').reduce((prev, curr) => {
			if (isNaN(parseInt(curr))) return prev;
			else return prev + parseInt(curr);
		}, 0);
	} else {
		awards = 0;
	}

	let boxOffice = movieDetails.BoxOffice;

	if (boxOffice.indexOf('$') >= 0) {
		boxOffice = boxOffice.replace(/\$/, '').split(',').join('');
	}
	boxOffice = !isNaN(parseInt(boxOffice)) ? parseInt(boxOffice) : 0;

	let metaScore = movieDetails.Metascore !== 'N/A' ? parseInt(movieDetails.Metascore) : 0;

	let votes = movieDetails.imdbVotes !== 'N/A' ? parseInt(movieDetails.imdbVotes.split(',').join('')) : 0;
	//Need not do parseInt in above variables.
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
                                <article data-value="${parseInt(awards)}" class="is-primary notification">
                                        <p class="title">${movieDetails.Awards ? movieDetails.Awards : 'N/A'}</p>
                                        <p class="subtitle">Awards</p>
                                </article>
                                <article data-value="${boxOffice}"class="is-primary notification">
                                        <p class="title">${movieDetails.BoxOffice ? movieDetails.BoxOffice : 'N/A'}</p>
                                        <p class="subtitle">Box Office</p>
                                </article>
                                <article data-value="${metaScore}" class="is-primary notification">
                                        <p class="title">${movieDetails.Metascore ? movieDetails.Metascore : 'N/A'}</p>
                                        <p class="subtitle">Metascore</p>
                                </article>      
                                <article data-value="${votes}" class="is-primary notification">
                                        <p class="title">${movieDetails.imdbVotes ? movieDetails.imdbVotes : 'N/A'}</p>
                                        <p class="subtitle">IMDB Votes</p>
                                  </article>
                              
                        </div>
                </div>
        `;

	const leftSide = document.querySelectorAll('#left-summary article');
	const rightSide = document.querySelectorAll('#right-summary article');

	if (leftSide.length && rightSide.length) {
		if (side === 'right') {
			leftSide.forEach((leftSideArticle) => {
				if (leftSideArticle.classList.contains('is-warning')) {
					leftSideArticle.classList.remove('is-warning');
					leftSideArticle.classList.add('is-primary');
				}
			});
		} else {
			rightSide.forEach((rightSideArticle) => {
				if (rightSideArticle.classList.contains('is-warning')) {
					rightSideArticle.classList.remove('is-warning');
					rightSideArticle.classList.add('is-primary');
				}
			});
		}
	}

	if (leftSide.length && rightSide.length) {
		leftSide.forEach((leftSideArticle, index) => {
			const leftSideValue = parseInt(leftSideArticle.dataset.value);
			const rightSideArticle = rightSide[index];
			const rightSideValue = parseInt(rightSideArticle.dataset.value);

			if (rightSideValue > leftSideValue) {
				leftSideArticle.classList.remove('is-primary');
				leftSideArticle.classList.add('is-warning');
			} else {
				rightSideArticle.classList.remove('is-primary');
				rightSideArticle.classList.add('is-warning');
			}
		});
	}
};

createAutoCompleteConfig = {
	fetchData(inputDOM, returned) {
		fetchMovies(inputDOM, (movies) => {
			returned(movies);
		});
	},
	displayList(movie, resultDOM) {
		//console.log(movie)
		const moviePoster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/150' : movie.Poster;
		resultDOM.innerHTML += `
                       <a class="dropdown-item items" href="#" >
                               <img class="list-img" src="${moviePoster}">
                               <div id="${movie.imdbID}"> ${movie.Title}</div>
                               (${movie.Year})
                       </a>
               `;
		return;
	}
};

createAutoComplete({
	...createAutoCompleteConfig,
	root: document.querySelector('#left-autocomplete'),
	fetchDetails(option) {
		const movie = option;
		const movieId = movie.getAttribute('id');

		fetchMovieDetails(movieId, (movieDetails) => {
			buildMovieTemplate(movieDetails, document.querySelector('#left-summary'), 'left');
		});
	}
});

createAutoComplete({
	...createAutoCompleteConfig,
	root: document.querySelector('#right-autocomplete'),
	fetchDetails(option) {
		const movie = option;
		const movieId = movie.getAttribute('id');

		fetchMovieDetails(movieId, (movieDetails) => {
			buildMovieTemplate(movieDetails, document.querySelector('#right-summary'), 'right');
		});
	}
});
