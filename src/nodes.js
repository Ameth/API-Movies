const $ = (id) => document.querySelector(id);

// Sections
const headerSection = $('#header');
const trendingPreviewSection = $('#trendingPreview');
const likedSection = $('#liked');
const categoriesPreviewSection = $('#categoriesPreview');
const genericSection = $('#genericList');
const movieDetailSection = $('#movieDetail');

// Lists & Containers
const searchForm = $('#searchForm');
const listContainer = $(".listGenres-container");
const trendingMoviesPreviewList = $('.trendingPreview-movieList');
const genericMovieList = $(".generic-movieList");
const categoriesPreviewList = $('.categoriesPreview-list');
const movieDetailCategoriesList = $('#movieDetail .categories-list');
const relatedMoviesContainer = $('.relatedMovies-scrollContainer');
const likedMovieListContainer = $('.liked-movieList');

// Elements
const headerTitle = $('.header-title');
const arrowBtn = $('.header-arrow');
const headerCategoryTitle = $('.header-title--categoryView');
const genericListTitle = $(".genericList-title")
const genericListResults = $(".genericList-results")

const searchFormInput = $('#txtSearch');
const searchFormBtn = $('#btnSearch');

const trendingBtn = $('.trendingPreview-btn');

const movieDetailTitle = $('.movieDetail-title');
const movieDetailDescription = $('.movieDetail-description');
const movieDetailScore = $('.movieDetail-score');
const movieDetailTitleHeader = $('.header-movie-title');
const movieDetailCast = $("#movieCast");
const movieDetailDirector = $("#movieDirector");