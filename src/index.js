import './css/styles.css';

import Notiflix from 'notiflix';

// import axios from 'axios';

//todo -------------------  OLD  уже не надо-----------------------
// // Библиотека SimpleLightbox
// import SimpleLightbox from "simplelightbox";
// // Библиотека SimpleLightbox - дополнительный импорт стилей
// import "simplelightbox/dist/simple-lightbox.min.css";
//todo ________________________________________________________________


//! Импорт класса ThemoviedbApiService с ./js/get-refs.js
import ThemoviedbApiService from './js/api-themoviedb.js';

//! Импорт всех ссылок с ./js/get-refs.js
import getRefs from './js/get-refs.js';

//! Импорт класса LoadMoreBtn Кнопки LOAD MORE
import LoadMoreBtn from './js/load-more-btn.js';

//! Импорт массива объектов всех жанров из файла genres.js (ВРЕМЕННО. Надо сделать два запроса)
import { genres } from './js/genres.js'; //? api-themoviedb

//______________________________________________ конец всех import _______________________________________________________





//! Создаем объект всех ссылок refs.*
const refs = getRefs();


//! Создаем экземпляр класса ThemoviedbApiService
const themoviedbApiService = new ThemoviedbApiService();

//! Создаем экземпляр класса LoadMoreBtn = Кнопка LOAD MORE
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more1"]',
    hidden: true,
});

// console.log(loadMoreBtn);
// loadMoreBtn.show()
// loadMoreBtn.disable()

//todo -------------------  OLD  уже не надо-------------------------
// Вызов библиотеки SimpleLightbox:
// // let gallery = new SimpleLightbox('.gallery a');

// let gallery = new SimpleLightbox('.gallery a', {
//     // caption: true,
//     captionPosition: 'bottom',
//     captionDelay: 250,
//     captionsData: "alt",
// });
//todo ________________________________________________________________






//* +++++++++++++++++++++++++++++++ Создаем ВСЕХ слушателей +++++++++++++++++++++++++++++++++++++++++
//!  Создаем слушателя событий на поле ввода данных - input form:
// refs.searchForm.addEventListener('submit', onFormSearch); //todo OLD
refs.searchForm.addEventListener('submit', onFormMoviesSearch);

//!  Создаем слушателя событий на кнопке LOAD MORE:
// refs.loadMoreBtn.addEventListener('click', onLoadMore); // OLD => через import getRefs from './js/get-refs.js'
loadMoreBtn.refs.button.addEventListener('click', onLoadMore); // NEW => через import LoadMoreBtn from './js/load-more-btn.js


//? +++++++++++++++++++++++++++++++ refs - themoviedb +++++++++++++++++++++++++++++++++++++++++

//! Создаем слушателя событий на кнопке HOME:
refs.homeBtn.addEventListener('click', onHome);

//! Создаем слушателя событий на кнопке Filmoteka:
refs.filmotekaBtn.addEventListener('click', onHome);

//! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
// console.log(refs.inputAlert); //!
refs.resultNotSuccessful.hidden = true;

//! Создаем слушателя событий на <section class="section-hero">:
refs.movieDetails.addEventListener('click', onMovieDetails);


//* __________________________________ КОНЕЦ создаения ВСЕХ слушателей __________________________________




//! Создаем глобальную переменную (films) для хранения значение всей (results)
let films = [];

//! Создаем глобальную переменную (idFilms) для хранения idF одного фильма
let idFilms = 0;


// Переменная для определения типа запроса в кнопке LOAD MORE - пока не пригодилась
let currentPage = "";






//? +++++++++++++++++++++++++++++++ Функции - themoviedb +++++++++++++++++++++++++++++++++++++++++

//? Тестируем - консолим тип жанра по его id
console.log("genres:", genres); //!
// const genreName = convertingIdToGenre(10770);
// console.log("genreName:", genreName); //!



//! Загрузка популярных фильмов на главную (первую) страницу (без нажатия на кнопки HOME или Filmoteka)
// onHome();



//* -------------------------- Ф-ция-запрос_1, к-рая прослушивает события на кнопке HOME: ----------------------
//! +++ Загрузка популярных фильмов на главную (первую) страницу (без нажатия на кнопки HOME или Filmoteka) +++
async function onHome() {
    //! Задаем значение переменной (currentPage = "home-Filmoteka") для определения типа запроса в кнопке LOAD MORE
    currentPage = "home-Filmoteka";

    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! Делаем сброс значения page = 1 после submit form 
    //! с помощью метода resetPage из класса ThemoviedbApiService
    themoviedbApiService.resetPage();

    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show()
    loadMoreBtn.disable();

    //! Очищаем контейнер:
    clearHitsContainer();

    //! Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
    const results = await themoviedbApiService.getTrendingAllDay();

    //! Перезаписываем в глобальную переменную (films) значение всей (results)
    films = results;

    //? ------- Получаем и консолим все данные для рендера разметки главной страницы -------
    // console.log("results:", results); //!
    // results.map(result => {
    //     console.log("id:", result.id);

    //     console.log("poster_path:", result.poster_path);

    //     // console.log("title or name:", result.title || result.name); //* работает, можно так
    //     const titleOrName = result.title || result.name;
    //     console.log("titleOrName:", titleOrName);

    //     // console.log("genre_ids:", result.genre_ids); //!
    //     //? Получаем массив жанров для каждого фильма и строку всех жанров:
    //     const genresAllOneFilmArray = result.genre_ids.map(id => convertingIdToGenre(id));
    //     // console.log("genresOneFilm:", genresAllOneFilmArray); //! массив жанров для каждого фильма
    //     const genresAllOneFilm = genresAllOneFilmArray.join(", ");
    //     console.log("genresAllOneFilm:", genresAllOneFilm); //! строка всех жанров

    //     //? Получаем значение года из строки даты:
    //     const date = result.first_air_date || result.release_date || "???? - ?? - ??";;
    //     // console.log("date:", date); //!
    //     const yearDate = date.substr(0, 4);
    //     console.log("yearDate:", yearDate);
    // });
    //?_________________КОНЕЦ Получения и консоли всех данных _____________________

    //! Рисование интерфейса 
    appendHitsMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();

    //? Использование библиотеки SimpleLightbox:
    // gallery.refresh();  
}



//* ---------- Ф-ция-запрос_2, к-рая прослушивает события на поле ввода данных - input form:-------
//! ++++++++++ Пошук та відображення фільмів за ключовим словом из input form +++++++++++
async function onFormMoviesSearch(evt) {
    evt.preventDefault();
    //! это то, что приходит в input и 
    //! записывается с помощью сетера класса ThemoviedbApiService в переменную searchQuery
    themoviedbApiService.query = evt.currentTarget.elements.searchQuery.value.trim(); //! + убираем пробелы
    console.log("searchQuery: ", themoviedbApiService.query); //!
    // console.log("evt.currentTarget.elements.searchQuery.value: ", evt.currentTarget.elements.searchQuery.value); //!
    evt.currentTarget.elements.searchQuery.value = "";
    // console.log("evt.currentTarget.elements.searchQuery.value: ", evt.currentTarget.elements.searchQuery.value); //!

    if (themoviedbApiService.query === "") {
        return alert("Поле ввода не долно быть пустым!");
    };

    //! Задаем значение переменной (currentPage = "Movie search") для определения типа запроса в кнопке LOAD MORE
    currentPage = "Movie search";

    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! Делаем сброс значения page = 1 после submit form 
    //! с помощью метода resetPage из класса ThemoviedbApiService
    themoviedbApiService.resetPage();

    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show();
    loadMoreBtn.disable();


    //! Очищаем контейнер при новом вводе данных в input form:
    clearHitsContainer();

    //! Делаем ОБЩИЙ fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
    const results = await themoviedbApiService.getSearchMovies();
    // console.log("results:", results); //!

    //! Перезаписываем в глобальную переменную (films) значение всей (results)
    films = results;

    //! ПРОВЕРКА hits на пустой массив
    checkHitsForEmpty(results);

    //! Рисование интерфейса
    appendHitsMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();

    //? Использование библиотеки SimpleLightbox:
    // gallery.refresh();
};
//! +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//* -------------------------- Ф-ция-запрос_3, к-рая запрашивает полную информацию об одном фильме: ----------------------
//! +++ _____ +++
async function onMovieDetails(event) {
    // console.log("Вешаю слушателя на onMovieDetails"); //!
    if (event.target.src) {
        //! Получаем (id) фильма для отрисовки карточки с полной информацией об этом фильме
        // console.log("event.target.src: ", event.target.src); //!
        // const allPosterPath = event.target.substr(33);
        const allPosterPath = String(event.target.src);
        // alert(typeof allPosterPath); // string //!
        // console.log("allPosterPath:", allPosterPath); //!
        const posterPath = allPosterPath.substring(31);
        // console.log("posterPath:", posterPath); //!

        console.log("films:", films); //!

        const i = films.findIndex(film => film.poster_path === posterPath)
        // console.log("i:", i); //!
        idFilms = films[i].id; //! id фильма
    } else return;

    console.log("idFilms:", idFilms); //! id фильма

    //! ==> Делаем запрос

    //! ==> Рисуем модалку

}




//* ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE (для Ф-ции-запрос_1) ++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
async function onLoadMore(evt) {
    loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем


    //! Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
    const results = await themoviedbApiService.getTrendingAllDay();

    //! Перезаписываем в глобальную переменную (films) значение всей (results)
    films = results;

    //! Очищаем контейнер:
    clearHitsContainer();

    //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
    // checkHitsForEnd(endOfCollection);

    //! Рисование интерфейса
    appendHitsMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();
}
//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//! НЕ РАБОТАЕТ, ==>  ЗАВИСАЕТ!!! 
//?   Ф-ция, к-рая проверяет значения переменной (currentPage) для определения типа запроса в кнопке LOAD MORE
// async function checkResults() {
//     if (currentPage === "home-Filmoteka") {
//         const results = await themoviedbApiService.getTrendingAllDay();
//         return results;
//     } else {
//         if (currentPage === "Movie search") {
//             const results = await themoviedbApiService.getSearchMovies();
//             return results;
//         } else {
//             return;
//         }
//     };

//* ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE (для Ф-ции-запрос_2) ++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
// async function onLoadMore(evt) {

//     loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем


//     //? Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
//     const results = await themoviedbApiService.getSearchMovies();

//     //! Делаем fetch-запрос исходя из проверки значения переменной (currentPage):
//     //! Проверка значения переменной (currentPage) для определения типа запроса в кнопке LOAD MORE
//     // checkResults();

//     // if (currentPage === "home-Filmoteka") {
//     //     const results = await themoviedbApiService.getTrendingAllDay();
//     //     // return results;
//     // } else {
//     //     if (currentPage === "Movie search") {
//     //         const results = await themoviedbApiService.getSearchMovies();
//     //         // return results;
//     //     } else {
//     //         // return;
//     //     }

//     // console.log("onLoadMore ==> results:", results); //!

//     //! Очищаем контейнер:
//     clearHitsContainer();

//     //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
//     // checkHitsForEnd(endOfCollection);

//     //! Рисование интерфейса
//     appendHitsMarkup(results);

//     //! Кнопка LOAD MORE => включаем
//     loadMoreBtn.enable();
// }
//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//? --------------------------- themoviedb-Функции ---------------------
//!  Ф-ция, к-рая получает id жанра и возвращает тип жанра
function convertingIdToGenre(id) {
    const genre = genres.filter(genre => genre.id === id);
    // console.log("genre:", genre); //! 
    // console.log("genre[0].name:", genre[0].name); //!
    return genre[0].name;
}


//!   Ф-ция, к-рая очищает контейнер при новом вводе данных в input form:
function clearHitsContainer() {
    refs.imageCards.innerHTML = "";
}


//!  Ф-ция, к-рая  прверяет results на пустой массив:
function checkHitsForEmpty(results) {
    if (!results.length) {
        //! ПОКАЗЫВАЕМ строку предупреждения об отсутствии фильмов:
        refs.resultNotSuccessful.hidden = false;
        Notiflix.Notify.failure(`Search result not successful. Enter the correct movie name and`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
}
//?_____________________________________________________________________



//todo ------------------------- OLD-Функции ------------------------------------
//? Ф-ция, к-рая проверяет hits на ОКОНЧАНИЕ КОЛЛЕКЦИИ
function checkHitsForEnd(endOfCollection) {
    if (endOfCollection <= 0) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
}


//?   Ф-ция, к-рая консолит свойство totalHits:
function showsTotalHits(totalHits) {
    if (totalHits > 0)
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, { timeout: 3000, },);
}
//todo __________________________________________________________________________



//! +++++++++++++++++++++++++++++ Markup ++++++++++++++++++++++++++++++++++++++++++++++++++++
//*  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendHitsMarkup(results) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.imageCards.insertAdjacentHTML('beforeend', createImageCardsMarkup(results));
    // console.log(hits[0].largeImageURL); //! ссылка на большое изображение
}


//*   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки:
function createImageCardsMarkup(results) {
    return results
        .map(({ id, poster_path, title, name, genre_ids, first_air_date, release_date }) => {

            //? Получаем массив жанров для каждого фильма и строку всех жанров:
            const genresAllOneFilmArray = genre_ids.map(id => convertingIdToGenre(id)); //! массив жанров для каждого фильма
            // console.log("genresOneFilm:", genresAllOneFilmArray); //!
            const genresAllOneFilm = genresAllOneFilmArray.join(", "); //! строка всех жанров
            // console.log("genresAllOneFilm:", genresAllOneFilm); //!

            //? Получаем значение года из строки даты:
            const date = first_air_date || release_date || "???? - ?? - ??";
            // console.log("date:", date); //!
            const yearDate = date.substr(0, 4); //! значение года из строки даты:
            // console.log("yearDate:", yearDate); //!

            return `
            <div >
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="" />

                <div>
                    <h5>${title || name}</h5>
                    <h5>${genresAllOneFilm} | ${yearDate}</h5>
                </div>
            </div>
            `;
        })
        .join('');
};



//todo ---------------------------  OLD  уже не надо---------------------------------------------
// +++++++++++++++++++++++++++++++++++ input form +++++++++++++++++++++++++++++++++++++++++++++++
//  Ф-ция, к-рая прослушивает события на поле ввода данных - input form:
// function onFormSearch(evt) {
//     evt.preventDefault();
//     // console.log("Вешаю слушателя на поле ввода данных - input form"); //!

//     //! это то, что приходит в input и
//     //! записывается с помощью сетера класса ThemoviedbApiService в переменную searchQuery
//     themoviedbApiService.query = evt.currentTarget.elements.searchQuery.value.trim(); //! + убираем пробелы
//     console.log("searchQuery: ", themoviedbApiService.query); //!

//     if (themoviedbApiService.query === "") {
//         return alert("Поле ввода не долно быть пустым!");
//     }

//     //! Кнопка LOAD MORE => показываем и отключаем
//     loadMoreBtn.show()
//     loadMoreBtn.disable()

//     //! Делаем сброс значения page = 1 после submit form
//     //! с помощью метода resetPage из класса ThemoviedbApiService
//     themoviedbApiService.resetPage()

//     //! Очищаем контейнер при новом вводе данных в input form:
//     clearHitsContainer()

//     loadMoreBtn.disable()
//     //? Делаем ОБЩИЙ fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
//     themoviedbApiService.fetchHits()
//         .then(({ totalHits, hits, endOfCollection }) => {
//             // console.log("totalHits: ", totalHits); //!
//             // console.log("hits: ", hits); //!
//             // console.log("endOfCollection: ", endOfCollection); //!

//             //! ПРОВЕРКА hits на пустой массив
//             checkHitsForEmpty(hits)

//             showsTotalHits(totalHits) //* Консолим свойство totalHits
//             return hits
//         })
//         .then(hits => {
//             appendHitsMarkup_OLD(hits); //* Рисование интерфейса выносим в отдельную ф-цию
//             loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
//             gallery.refresh();  //? Использование библиотеки SimpleLightbox:
//         });
// };
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE _OLD ++++++++++++++++++++++++++++++++++++++++++++
//  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
// function onLoadMore(evt) {
//     loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем
//     //? Делаем fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
//     themoviedbApiService.fetchHits()
//         .then(({ totalHits, hits, endOfCollection }) => {
//             // console.log("totalHits: ", totalHits); //!
//             // console.log("hits: ", hits); //!

//             //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
//             checkHitsForEnd(endOfCollection)
//             return hits
//         })
//         // .then(appendHitsMarkup); // Рисование интерфейса выносим в отдельную ф-цию
//         .then(hits => {
//             appendHitsMarkup_OLD(hits); //* Рисование интерфейса выносим в отдельную ф-цию
//             loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
//             gallery.refresh();  //? Использование библиотеки SimpleLightbox:
//         });
// }
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



//  +++++++++++++++++++++++++++++ Markup _OLD ++++++++++++++++++++++++++++++++++++++++++++++++++++
// _OLD Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
// function appendHitsMarkup_OLD(results) {
//     //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
//     refs.imageCards.insertAdjacentHTML('beforeend', createImageCardsMarkup_OLD(results));
//     // console.log(hits[0].largeImageURL); //! ссылка на большое изображение
// }


// _OLD  Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки:
// function createImageCardsMarkup_OLD(hits) {
//     return hits
//         .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
//             return `
//                 <div class="photo-card">
//                         <a class="gallery__link" href="${largeImageURL}">
//                             <img class="img-card"
//                                 src="${webformatURL}"
//                                 alt=${tags}
//                                 loading="lazy"
//                             />
//                         </a>
//                     <div class="info">
//                         <p class="info-item">
//                             <b>Likes</b>
//                             <b class="info-data">${likes}</b>
//                         </p>
//                         <p class="info-item">
//                             <b>Views</b>
//                             <b class="info-data">${views}</b>
//                         </p>
//                         <p class="info-item">
//                             <b>Comments</b>
//                             <b class="info-data">${comments}</b>
//                         </p>
//                         <p class="info-item">
//                             <b>Downloads</b>
//                             <b class="info-data">${downloads}</b>
//                         </p>
//                     </div>
//                 </div>
//             `;
//         })
//         .join('');
// }