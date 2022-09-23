// import axios from 'axios';

// const BASE_URL = 'https://restcountries.com/v3.1';


// //*   Ф-ция, которая делает HTTP-запрос на ресурс name 
// //*  и возвращает промис с массивом стран по ID или Name:
// function fetchCountries(name) {
//     // console.log(name); //!

//     //? return axios.get(`${BASE_URL}/name/${name}`)
//     return axios.get(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
//         .then(response => {
//             return response.data;
//             // return response.json();
//         })
// }

// export default { fetchCountries };

//! Пока не менял НИЧЕГО

//! async / await.

// return axios.get(url) //! old = return fetch(url)

//     .then(response => {
//         return response.data;
//     })

//     .then(({ totalHits, hits }) => {

//         const endOfCollection = totalHits - this.page * this.per_page

//         this.incrementPage();
//         const all = { totalHits, hits, endOfCollection }
//         return all
//     })

//! NEW ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//! Ф-ция делает ОБЩИЙ fetch-запрос:
const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`; //! with API_KEY

async function fetchHits() {

    const response = await axios.get(url);
    const newHits = await response.data;
    return newHits
}

    //     .then(({ totalHits, hits }) => {

    //     const endOfCollection = totalHits - this.page * this.per_page

    //     this.incrementPage();
    //     const all = { totalHits, hits, endOfCollection }
    //     return all
    // })

