let api_url_image;

const API_CONF = `/configuration`;
const API_TRENDING_PREVIEW = `/trending/movie/`;
const API_LIST_GENRES = `/genre/movie/list`;
const API_MOVIE_GENRES = `/discover/movie`;
const API_SEARCH_MOVIE = `/search/movie`;
const API_MOVIE_DETAIL = `/movie/`;

//Data

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        'api_key': API_KEY,
        'language': 'es'
    }
})

const getLikedMovieList = () => {
    const list = localStorage.getItem("liked_movies");
    let movies;

    if (list) {
        movies = JSON.parse(list);
    } else {
        movies = {}
    }

    return movies;
}

const likeMovie = (movie) => {
    // {'id_movie': {...movie}, 'id2_movie': {...movie}}

    const movieList = getLikedMovieList();

    if (movieList[movie.id]) {
        // console.log("Ya existe");
        movieList[movie.id] = undefined;
    } else {
        // console.log("No existe");
        movieList[movie.id] = movie;
    }

    localStorage.setItem("liked_movies", JSON.stringify(movieList));
    getLikedMovies();
}

//Utils

const loadMovieImg = (entries, observador) => {
    // console.log(entries);
    entries.forEach(item => {
        if (item.isIntersecting) {
            // console.log(item.target);
            // console.log(`Observo ${item.target.dataset.title}`);
            // console.log(`${item.target.dataset.img}`);
            // item.target.src = item.target.dataset.src;
            if (item.target.dataset.img !== "null") {
                item.target.src = item.target.dataset.src;
            } else {
                // console.log("Es NULL");
                item.target.classList.add("movie-img--null");
            }
            observador.unobserve(item.target);

        }
    })
}

const scrollIsBottom = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    // 15 porque a veces el calculo no es exacto, entonces se le restan algunos pixeles
    return (scrollTop + clientHeight) >= scrollHeight - 15;
}

const observerMovie = new IntersectionObserver(loadMovieImg, {
    threshold: .25
});

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

const renderMovies = (movies, parentContainer, { clean = true, liked_btn = true } = { clean: true, liked_btn: true }) => {

    if (clean) {
        parentContainer.innerHTML = "";
    }

    // console.log("likedBtn:", liked_btn);

    if (movies.length > 0) {
        movies.map(movie => {
            const movieContainer = document.createElement("div");
            const imgMovie = document.createElement("img");

            movieContainer.classList.add("movie-container");
            movieContainer.addEventListener("click", () => {
                location.hash = `#movie=${movie.id}`;
            });

            observerMovie.observe(imgMovie);

            imgMovie.dataset.src = `${api_url_image}w185${movie.poster_path}`;
            imgMovie.dataset.img = `${movie.poster_path}`;
            imgMovie.dataset.title = `${movie.title}`;
            // imgMovie.src = `${api_url_image}w185${movie.poster_path}`;
            imgMovie.classList.add("movie-img");
            imgMovie.alt = `${movie.title}`;
            // imgMovie.addEventListener("error", console.log);

            movieContainer.appendChild(imgMovie);

            if (liked_btn) {
                const likeBtn = document.createElement("button");
                likeBtn.classList.add("liked-btn");
                getLikedMovieList()[movie.id] && likeBtn.classList.add("liked-btn--liked");
                likeBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    likeBtn.classList.toggle("liked-btn--liked");

                    //Agregar la pelicula a localStorage
                    likeMovie(movie);
                })
                movieContainer.appendChild(likeBtn);
            }

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

const getTendenciasAll = async(page = 1) => {

    const { data } = await api.get(`${API_TRENDING_PREVIEW}/day`, {
        params: {
            page
        }
    });
    max_page = data.total_pages;
    // console.log(max_page);
    // const page2 = await api.get(`${API_TRENDING_PREVIEW}/week?page=2`);

    // results = [...page1.data.results, ...page2.data.results]

    // (page == 1) devolverá true si se cumple, false si no. 
    // Es lo mismo que: (page == 1) ? true : false
    renderMovies(data.results, genericMovieList, { clean: (page == 1) });


    /***  Código agregando un botón de "Cargar más" ****/
    // const btnCargarMas = document.createElement("button");
    // btnCargarMas.innerText = "Cargar más";
    // btnCargarMas.classList.add("trendingPreview-btn");
    // genericSection.appendChild(btnCargarMas);

    // btnCargarMas.addEventListener("click", () => {
    //     getTendenciasAll(page + 1);

    //     // Aqui borro el botón actual, no el nuevo que se va a crear, porque este nuevo se crea en un nuevo hilo, un nuevo scope al ejecutar la función.
    //     btnCargarMas.remove();
    // });


    /***  Código de cargar más haciendo infinite scroll ****/
    // Este se pasó al archivo navigation.js
    // if (scrollIsBottom()) {
    //     getTendenciasAll(page);
    //     page++;
    // }

}

const getMovieByGenres = (gen_id, page = 1) => {
    return async() => {
        const { data } = await api.get(API_MOVIE_GENRES, {
            params: {
                with_genres: gen_id,
                include_adult: true,
                page
            }
        });

        max_page = data.total_pages;

        // console.log("ejecutando pagina " + page);

        const results = data.results;

        renderMovies(results, genericMovieList, { clean: (page == 1) });
    }
}

const getSearchMovie = (query, page = 1) => {
    return async() => {
        const { data } = await api.get(API_SEARCH_MOVIE, {
            params: {
                include_adult: true,
                query,
                page
            }
        });

        max_page = data.total_pages;
        genericListResults.innerHTML = `Resultados: ${data.total_results}`;
        // console.log(max_page);

        const results = data.results;

        renderMovies(results, genericMovieList, { clean: (page == 1) });
    }
}

const getMovieDetail = async(movie_id) => {

    const { data: movie } = await api.get(`${API_MOVIE_DETAIL}${movie_id}?language=es`);
    const { data: { cast, crew } } = await api.get(`${API_MOVIE_DETAIL}${movie_id}/credits?language=es`);

    movieDetailTitle.innerHTML = movie.title;
    movieDetailDescription.innerHTML = movie.overview;
    movieDetailScore.innerHTML = movie.vote_average;
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url('${api_url_image}w1280${movie.backdrop_path}')`;
    movieDetailTitleHeader.innerHTML = movie.title;

    const characters = cast.filter((item, index) => index < 5);
    const directors = crew.filter(member => member.known_for_department === "Directing" && member.job === "Director");

    movieDetailCast.innerHTML = characters.flatMap(item => item.name).join(", ");
    movieDetailDirector.innerHTML = (directors.length > 0) ? directors[0].name : "";

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

const getLikedMovies = () => {
    const data = getLikedMovieList();
    const results = Object.values(data);

    // console.log(results);

    renderMovies(results, likedMovieListContainer);
}

obtenerConfAPI();