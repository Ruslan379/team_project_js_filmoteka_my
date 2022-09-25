import axios from 'axios';

//? +++++++++++++++++++++++++++++++ api-themoviedb +++++++++++++++
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
// const url_1 = `${BASE_URL}/${END_POINTS_1}?api_key=${API_KEY}`;
// console.log("url_1: ", url_1); //!

const url_2 = `${BASE_URL}/${END_POINTS_2}?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`;
console.log("url_2: ", url_2); //!

const url_3 = `${BASE_URL}/${END_POINTS_3}/${movie_id}?api_key=${API_KEY}&language=en-US`;
console.log("url_3: ", url_3); //!

const url_4 = `${BASE_URL}/${END_POINTS_4}/${movie_id}/${CREDITS}?api_key=${API_KEY}&language=en-US`;
console.log("url_4: ", url_4); //!

const url_5 = `${BASE_URL}/${END_POINTS_5}/${movie_id}/${REVIEWS}?api_key=${API_KEY}&language=en-US&page=${page}`;
console.log("url_5: ", url_5); //!
//!-----------------------------------------------------------------------------------------------------------------------------------------------------------

//?_______________________________________________________________




//! Переменные для URL-запроса:
const API_KEY_OLD = '28759369-3882e1068ac26fe18d14affeb';
const BASE_URL_OLD = 'https://pixabay.com/api/';





export default class ThemoviedbApiService {
    constructor() {
        this.searchQuery = ""; //! это то, что приходит в input
        //! Пагинация:
        this.page = 1; //! номер страницы (группы) в fetch-запросе
        this.per_page = 40; // по ТЗ надо 40
    }

    //? ++++++++++++++++++++++++++++++++++++++++++++++ Формируем URL-запросы: ++++++++++++++++++++++++++++++++++++++++++++++
    //? 1 - Загрузка популярных фильмов на главную (первую) страницу 
    async getTrendingAllDay() {
        const url_1 = `${BASE_URL}/${END_POINTS_1}?api_key=${API_KEY}`;
        // console.log("url_1: ", url_1); //!
        const response = await axios.get(url_1) //! 1 
        const { results } = response.data
        return results;
    }






    //?_______________________________________________________________

    async fetchHits() {

        const url_old = `${BASE_URL_OLD}?key=${API_KEY_OLD}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`; //! with API_KEY
        // console.log("url_old: ", url_old); //!

        const response = await axios.get(url_old);
        const newHits = await response.data;
        console.log("url_old: ", url_old); //!
        console.log("newHits: ", newHits); //! 

        const { totalHits, hits } = newHits;

        const endOfCollection = totalHits - this.page * this.per_page //! 
        console.log("endOfCollection: ", endOfCollection);

        this.incrementPage();

        const all = { totalHits, hits, endOfCollection }
        return all
    }
    //! NEW _____________________________________________________________________________________


    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
