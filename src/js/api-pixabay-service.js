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
