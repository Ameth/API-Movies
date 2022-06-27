let page = 1;
let max_page = 1;
let fnLoadMorePage;

searchFormBtn.addEventListener("click", () => {
    location.hash = `#search=${searchFormInput.value.trim()}`;
})

trendingBtn.addEventListener("click", () => {
    location.hash = `#trends`;
})

window.addEventListener('scroll', fnLoadMorePage);

//Funcion general de navegación entre páginas
const navigatorPages = () => {
    // console.log(location);

    if (fnLoadMorePage) {
        window.removeEventListener("scroll", fnLoadMorePage);
        fnLoadMorePage = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trends();
    } else if (location.hash.startsWith('#search=')) {
        search();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetails();
    } else if (location.hash.startsWith('#category=')) {
        categories();
    } else {
        homePage();
    }

    smoothscroll();

    if (fnLoadMorePage) {
        window.addEventListener('scroll', fnLoadMorePage);
    }
}

//Funciones que obtienen más contenido paginado al hacer scroll
const getMoreTrends = () => {
    if (scrollIsBottom() && (page <= max_page)) {
        getTendenciasAll(page);
        page++;
    }
}

const getMoreCategories = (gen_id) => {
    return () => {
        // console.log("Haciendo scroll, valor de page: " + page);
        if (scrollIsBottom() && (page <= max_page)) {
            // console.log("Entro en if");
            getMovieByGenres(gen_id, page)();
            page++;
        }
    }
}

const getMoreSearch = (query) => {
    return () => {
        // console.log("Haciendo scroll, valor de page: " + page);
        if (scrollIsBottom() && (page <= max_page)) {
            // console.log("Entro en if");
            getSearchMovie(query, page)();
            page++;
        }
    }
}

//Funciones que cargan el contenido de cada sección de la aplicación
const homePage = () => {
    console.log('HOME');

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = '';
    headerTitle.classList.remove("inactive");
    trendingPreviewSection.classList.remove("inactive");
    searchForm.classList.remove("inactive");
    listContainer.classList.remove("inactive");
    genericListTitle.classList.remove("inactive");
    likedSection.classList.remove("inactive");

    arrowBtn.classList.add("inactive");
    genericSection.classList.add("inactive");
    genericListResults.classList.add("inactive");
    movieDetailSection.classList.add("inactive");
    movieDetailTitleHeader.classList.add("inactive");

    getListGenres();
    getLikedMovies();
    getTendenciasPreview();

}

const categories = () => {
    console.log('CATEGORIES');


    let [gen_id, gen_name] = location.hash.split('=')[1].split("-");

    gen_name = gen_name.split("%20");

    //join again in one word
    gen_name = gen_name.join(" ")

    //replace accents
    gen_name.includes('%C3%B3') ? gen_name = gen_name.replace('%C3%B3', 'ó') :
        gen_name.includes('%C3%A9') ? gen_name = gen_name.replace('%C3%A9', 'é') :
        gen_name.includes('%C3%AD') ? gen_name = gen_name.replace('%C3%AD', 'í') :
        gen_name.includes('%C3%BA') ? gen_name = gen_name.replace('%C3%BA', 'ú') : gen_name;


    genericListTitle.innerHTML = gen_name;

    fnLoadMorePage = getMoreCategories(gen_id);

    page = 2;
    getListGenres();
    getMovieByGenres(gen_id)();

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = '';
    headerTitle.classList.remove("inactive");
    arrowBtn.classList.remove("inactive");
    genericSection.classList.remove("inactive");
    listContainer.classList.remove("inactive");
    genericListTitle.classList.remove("inactive");

    movieDetailSection.classList.add("inactive");
    movieDetailTitleHeader.classList.add("inactive");
    searchForm.classList.add("inactive");
    genericListResults.classList.add("inactive");
    likedSection.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");

}

const search = () => {
    console.log('SEARCH');

    let [, query] = location.hash.split('=');

    fnLoadMorePage = getMoreSearch(query);

    page = 2;

    getSearchMovie(query)();

    trendingPreviewSection.classList.add("inactive");
    listContainer.classList.add("inactive");
    genericListTitle.classList.add("inactive");
    movieDetailSection.classList.add("inactive");
    movieDetailTitleHeader.classList.add("inactive");
    likedSection.classList.add("inactive");

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = '';
    headerTitle.classList.remove("inactive");
    arrowBtn.classList.remove("inactive");
    genericSection.classList.remove("inactive");
    genericListResults.classList.remove("inactive");


}

const trends = () => {
    console.log('TRENDS');

    genericListTitle.innerHTML = 'Tendencias';

    fnLoadMorePage = getMoreTrends;

    page = 2;
    getListGenres();
    getTendenciasAll();

    headerSection.classList.remove("header-container--long");
    headerSection.style.background = '';
    headerTitle.classList.remove("inactive");
    arrowBtn.classList.remove("inactive");
    genericSection.classList.remove("inactive");
    searchForm.classList.remove("inactive");
    listContainer.classList.remove("inactive");
    genericListTitle.classList.remove("inactive");

    trendingPreviewSection.classList.add("inactive");
    genericListResults.classList.add("inactive");
    movieDetailSection.classList.add("inactive");
    movieDetailTitleHeader.classList.add("inactive");
    likedSection.classList.add("inactive");


}

const movieDetails = () => {
    console.log('MOVIE DETAILS');

    let [, movie_id] = location.hash.split('=');

    getMovieDetail(movie_id);

    headerSection.classList.add("header-container--long");
    headerTitle.classList.add("inactive");
    arrowBtn.classList.remove("inactive");
    genericSection.classList.add("inactive");
    trendingPreviewSection.classList.add("inactive");
    searchForm.classList.add("inactive");
    listContainer.classList.add("inactive");
    genericListTitle.classList.add("inactive");
    genericListResults.classList.add("inactive");
    likedSection.classList.add("inactive");

    movieDetailSection.classList.remove("inactive");
    movieDetailTitleHeader.classList.remove("inactive");
}

const smoothscroll = () => {
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
};

window.addEventListener("hashchange", navigatorPages, false);
window.addEventListener("DOMContentLoaded", navigatorPages, false);


arrowBtn.addEventListener("click", () => location.hash = '#home');