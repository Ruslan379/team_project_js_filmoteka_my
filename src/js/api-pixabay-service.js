import axios from 'axios';

//! Переменные для URL-запроса:
const API_KEY = '28759369-3882e1068ac26fe18d14affeb';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixabayApiService {
    constructor() {
        this.searchQuery = ""; //! это то, что приходит в input
        //! Пагинация:
        this.page = 1; //! номер страницы (группы) в fetch-запросе
        this.per_page = 40; // по ТЗ надо 40
    }


    //! NEW ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // //! Ф-ция делает ОБЩИЙ axios.get-запрос: (NEW с использованием async/await)

    async fetchHits() {

        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`; //! with API_KEY

        const response = await axios.get(url);
        const newHits = await response.data;
        console.log("newHits: ", newHits);

        const { totalHits, hits } = newHits;

        const endOfCollection = totalHits - this.page * this.per_page
        console.log("endOfCollection: ", endOfCollection);

        this.incrementPage();

        const all = { totalHits, hits, endOfCollection }
        return all
    }
    //! NEW _____________________________________________________________________________________

    //? Ф-ция делает ОБЩИЙ fetch-запрос: (old с использованием .then)
    // fetchHits() {
    //     // console.log("this ДО: ", this); //!
    //     const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`; //! with API_KEY
    //     //! Делаем fetch-запрос:
    //     return axios.get(url) //! old = return fetch(url)
    //         // .then(response => response.json()) //! old = для return fetch(url)
    //         .then(response => {
    //             return response.data;
    //         })
    //         // .then(response => { console.log(response.hits); }) //!
    //         // .then(response => { console.log(response.totalHits); }) //!

    //         .then(({ totalHits, hits }) => {
    //             console.log("totalHits: ", totalHits); //!
    //             console.log("hits: ", hits); //!
    //             console.log("page: ", this.page); //!
    //             console.log("per_page: ", this.per_page); //!

    //             //? endOfCollection - это цифра еще НЕ ПРОСМОТРЕННЫХ элементов коллекции
    //             const endOfCollection = totalHits - this.page * this.per_page
    //             console.log("endOfCollection: ", endOfCollection); //!

    //             //! Проверка конца коллекции (НЕ ЗДЕСЬ)
    //             // if (endOfCollection <= 0) {
    //             //     Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`, { timeout: 3000, },);
    //             //     // спрятать кнопку LOAD MORE
    //             //     // return
    //             // }

    //             this.incrementPage();
    //             // console.log("this ПОСЛЕ: ", this); //!
    //             const all = { totalHits, hits, endOfCollection }
    //             console.log("all: ", all); //!
    //             // return hits
    //             return all

    //             // .then(response => {
    //             //     // console.log(response); //!
    //             //     this.incrementPage();
    //             //     // console.log("this ПОСЛЕ: ", this); //!
    //             //     return response.hits
    //         })
    // }
    //? _____________________________________________________________________________________


    //! У Ж Е   НЕ   Н А Д О  !!!!
    //! Ф-ция делает fetch-запрос для получения TotalHit:
    // fetchTotalHits() {
    //     const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`; //! with API_KEY
    //     //! Делаем fetch-запрос:
    //     return fetch(url)
    //         .then(response => response.json())
    //         .then(({ totalHits }) => {
    //             console.log(totalHits);  //!
    //             return totalHits
    //         })
    // }


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
