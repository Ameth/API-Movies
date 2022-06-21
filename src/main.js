let api_url_image;

const API_CONF = `/configuration`;
const API_TRENDING_PREVIEW = `/trending/movie/`;
const API_LIST_GENRES = `/genre/movie/list?language=es`;
const API_MOVIE_GENRES = `/discover/movie`;
const API_SEARCH_MOVIE = `/search/movie?language=es`;
const API_MOVIE_DETAIL = `/movie/`;

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        'api_key': API_KEY
    }
})

//Utils

const obtenerConfAPI = async() => {
    if (window.localStorage.getItem("api_url_image")) {
        api_url_image = window.localStorage.getItem("api_url_image");
        console.log("URL cacheado");
    } else {
        const { data } = await api.get(API_CONF);
        // const data = await res.json();
        // console.log(data);

        api_url_image = `${data.images.secure_base_url}`
        window.localStorage.setItem("api_url_image", api_url_image);
        console.log("URL fetcheado");
        // console.log(res);
        // console.log("URL Image:", api_url_image)
    }

}

const getListGenres = async() => {
    const { data } = await api.get(API_LIST_GENRES);
    const genres = data.genres;
    // console.log(data);
    // console.log(genres);

    listContainer.innerHTML = "";

    renderCategories(genres, listContainer);
}

const renderCategories = (genres, parentContainer) => {

    parentContainer.innerHTML = "";

    genres.map(genre => {
        const listItem = document.createElement("p");

        listItem.classList.add("listGenres-item");
        listItem.innerText = `${genre.name}`;
        listItem.id = `id${genre.id}`;
        listItem.addEventListener("click", () => {
            location.hash = `#category=${genre.id}-${genre.name}`;
        })

        parentContainer.appendChild(listItem);

    })
}

const renderMovies = (movies, parentContainer) => {

    parentContainer.innerHTML = "";

    if (movies.length > 0) {
        movies.map(movie => {
            const movieContainer = document.createElement("div");
            const imgMovie = document.createElement("img");

            movieContainer.classList.add("movie-container");
            movieContainer.addEventListener("click", () => {
                location.hash = `#movie=${movie.id}`;
            })

            imgMovie.src = `${api_url_image}w185${movie.poster_path}`;
            imgMovie.classList.add("movie-img");
            imgMovie.alt = `${movie.title}`;

            movieContainer.appendChild(imgMovie);
            parentContainer.appendChild(movieContainer);

        })
    } else {
        parentContainer.innerHTML = "No se encontraron resultados";
    }


}

//Llamadas a la API

const getTendenciasPreview = async() => {

    const { data } = await api.get(`${API_TRENDING_PREVIEW}/day`);
    const results = data.results;
    // console.log(res);
    // console.log(data);
    // console.log(results);

    renderMovies(results, trendingMoviesPreviewList);
}

const getTendenciasAll = async() => {

    const page1 = await api.get(`${API_TRENDING_PREVIEW}/week`);
    const page2 = await api.get(`${API_TRENDING_PREVIEW}/week?page=2`);

    results = [...page1.data.results, ...page2.data.results]

    renderMovies(results, genericMovieList);
}

const getMovieByGenres = async(gen_id) => {

    const { data } = await api.get(API_MOVIE_GENRES, {
        params: {
            with_genres: gen_id,
            include_adult: true,
        }
    });

    const results = data.results;

    renderMovies(results, genericMovieList);
}

const getSearchMovie = async(query) => {

    const { data } = await api.get(API_SEARCH_MOVIE, {
        params: {
            include_adult: true,
            query
        }
    });

    const results = data.results;

    renderMovies(results, genericMovieList);
}

const getMovieDetail = async(movie_id) => {

    const { data: movie } = await api.get(`${API_MOVIE_DETAIL}${movie_id}?language=es`);

    movieDetailTitle.innerHTML = movie.title;
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailScore.innerHTML = movie.vote_average;
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('${api_url_image}w1280${movie.backdrop_path}')`;
    movieDetailTitleHeader.innerHTML = movie.title;

    renderCategories(movie.genres, movieDetailCategoriesList);
    getSimilarMovies(movie.id);

}

const getSimilarMovies = async(movie_id) => {

    const { data } = await api.get(`${API_MOVIE_DETAIL}${movie_id}/similar?language=es`, {
        params: {
            include_adult: true
        }
    });
    const results = data.results;
    // console.log(res);
    // console.log(data);
    // console.log(results);

    renderMovies(results, relatedMoviesContainer);
}




obtenerConfAPI();