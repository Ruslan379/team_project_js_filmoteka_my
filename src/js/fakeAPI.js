import axios from 'axios';



//!-----------------------------------------------------------------------------------------------------------------------------------------------------------
//! Константы для URL-запросов:
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '41b230c5977baa736e324532e16fdadb';


const END_POINTS_1 = "trending/all/day" //!  /trending/all/day ==> список самых популярных фильмов на сегодня для создания коллекции на главной странице.

const END_POINTS_2 = "search/movie" //!  /search/search-movies ==> поиск кинофильма по ключевому слову на странице фильмов.
const query = "avatar" //?
const page = 1; //? можно добавить в строку запроса

const END_POINTS_3 = "movie" //!  /movies/get-movie-details ==> запрос полной информации о фильме для страницы кинофильма.
const movie_id = 616037 //?

const END_POINTS_4 = "movie" //!  /movies/get-movie-credits  ==> запрос информации об актёрском составе для страницы кинофильма.
const CREDITS = "credits"

const END_POINTS_5 = "movie" //!  /movies/get-movie-reviews ==> запрос обзоров для страницы кинофильма.
const REVIEWS = "reviews"


//!-----------------------------------------------------------------------------------------------------------------------------------------------------------
//! Формируем строки URL-запросов:
const url_1 = `${BASE_URL}/${END_POINTS_1}?api_key=${API_KEY}`;
console.log("url_1: ", url_1); //!

const url_2 = `${BASE_URL}/${END_POINTS_2}?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`;
console.log("url_2: ", url_2); //!

const url_3 = `${BASE_URL}/${END_POINTS_3}/${movie_id}?api_key=${API_KEY}&language=en-US`;
console.log("url_3: ", url_3); //!

const url_4 = `${BASE_URL}/${END_POINTS_4}/${movie_id}/${CREDITS}?api_key=${API_KEY}&language=en-US`;
console.log("url_4: ", url_4); //!

const url_5 = `${BASE_URL}/${END_POINTS_5}/${movie_id}/${REVIEWS}?api_key=${API_KEY}&language=en-US&page=${page}`;
console.log("url_5: ", url_5); //!


//!-----------------------------------------------------------------------------------------------------------------------------------------------------------
//! Формируем URL-запросы:
//! 1 
export async function getTrendingAllDay() {
    const response = await axios.get(url_1) //! 1 
    const { results } = response.data
    return results;
}



//! 2 
export async function getSearchMovies(query) {
    const response = await axios.get(`${BASE_URL}/${END_POINTS_2}?api_key=${API_KEY}&language=en-US&query=${query}&page=1&include_adult=false`) //!
    const { results } = response.data //*  /search/search-movies ==> поиск кинофильма по ключевому слову на странице фильмов.
    return results;
}



//! 3 
export async function getMovieDetails(movie_id) {
    const response = await axios.get(`${BASE_URL}/${END_POINTS_3}/${movie_id}?api_key=${API_KEY}&language=en-US`) //!
    return response.data;
}



//! 4 
export async function getMovieCast(movie_id) {
    const response = await axios.get(`${BASE_URL}/${END_POINTS_4}/${movie_id}/${CREDITS}?api_key=${API_KEY}&language=en-US`) //!
    return response.data;
}



//! 5 
export async function getMovieReviews(movie_id) {
    const response = await axios.get(`${BASE_URL}/${END_POINTS_5}/${movie_id}/${REVIEWS}?api_key=${API_KEY}&language=en-US&page=${page}`) //!
    return response.data;
}
