import './css/styles.css';

import Notiflix from 'notiflix';
// import axios from 'axios';

//! Библиотека SimpleLightbox
import SimpleLightbox from "simplelightbox";
// Библиотека SimpleLightbox - дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

import ThemoviedbApiService from './js/api-themoviedb.js'; // Импорт класса ThemoviedbApiService с ./js/get-refs.js
import getRefs from './js/get-refs.js'; // Импорт всех ссылок с ./js/get-refs.js
import LoadMoreBtn from './js/load-more-btn.js'; // Импорт класса LoadMoreBtn Кнопки LOAD MORE

//! Импорт массива объектов всех жанров из файла genres.js
import { genres } from './js/genres.js'; //? api-themoviedb

//______________________________________________ конец всех import _______________________________________________________






const refs = getRefs(); //! Создаем объект всех ссылок refs.*

const themoviedbApiService = new ThemoviedbApiService(); //! Экземпляр класса ThemoviedbApiService

//! Экземпляр класса LoadMoreBtn = Кнопка LOAD MORE
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more1"]',
    hidden: true,
});

// console.log(loadMoreBtn);
// loadMoreBtn.show()
// loadMoreBtn.disable() 


//! Вызов библиотеки SimpleLightbox:
// let gallery = new SimpleLightbox('.gallery a');

let gallery = new SimpleLightbox('.gallery a', {
    // caption: true,
    captionPosition: 'bottom',
    captionDelay: 250,
    captionsData: "alt",
});


//todo +++++++++++++++++++++++++++++++ Создаем ВСЕХ слушателей +++++++++++++++++++++++++++++++++++++++++
//!  Создаем слушателя событий на поле ввода данных - input form:
refs.searchForm.addEventListener('submit', onFormSearch);

//!  Создаем слушателя событий на кнопке LOAD MORE:
// refs.loadMoreBtn.addEventListener('click', onLoadMore); // OLD => через import getRefs from './js/get-refs.js'
loadMoreBtn.refs.button.addEventListener('click', onLoadMore); // NEW => через import LoadMoreBtn from './js/load-more-btn.js


//? +++++++++++++++++++++++++++++++ refs - themoviedb +++++++++++++++++++++++++++++++++++++++++

//! Создаем слушателя событий на кнопке HOME:
refs.homeBtn.addEventListener('click', onHome);

//! Создаем слушателя событий на кнопке Filmoteka:
refs.filmotekaBtn.addEventListener('click', onHome);
//todo __________________________________ КОНЕЦ создаения ВСЕХ слушателей __________________________________







//? +++++++++++++++++++++++++++++++ Функцмии - themoviedb +++++++++++++++++++++++++++++++++++++++++

//? Тестируем - консолим тип жанра по его id
console.log("genres:", genres); //!
// const genreName = convertingIdToGenre(10770);
// console.log("genreName:", genreName); //!



//! Загрузка популярных фильмов на главную (первую) страницу (без нажатия на кнопки HOME или Filmoteka)
// onHome();



//! -------------------------- Ф-ция-запос, к-рая прослушивает события на кнопке HOME: ----------------------
async function onHome() {
    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show()
    loadMoreBtn.disable();

    //! Очищаем контейнер:
    clearHitsContainer();

    //! Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
    const results = await themoviedbApiService.getTrendingAllDay();

    //! ------- Получаем и консолим все данные для рендера разметки главной страницы -------
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
    //     const date = result.first_air_date || result.release_date;
    //     // console.log("date:", date); //!
    //     const yearDate = date.substr(0, 4);
    //     console.log("yearDate:", yearDate);
    // });
    //!_________________КОНЕЦ Получения и консоли всех данных _____________________

    //! Рисование интерфейса
    appendHitsMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();

    //? Использование библиотеки SimpleLightbox:
    // gallery.refresh();  
}


//? --------------------------- themoviedb-Функции ---------------------
//!  Ф-ция, к-рая получает id жанра и возвращает тип жанра
function convertingIdToGenre(id) {
    const genre = genres.filter(genre => genre.id === id);
    // console.log("genre:", genre); //! 
    // console.log("genre[0].name:", genre[0].name); //!
    return genre[0].name;
}


//?_______________________________________________________________



//! +++++++++++++++++++++++++++++++++++ input form +++++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на поле ввода данных - input form:
function onFormSearch(evt) {
    evt.preventDefault();
    // console.log("Вешаю слушателя на поле ввода данных - input form"); //!

    //! это то, что приходит в input и 
    //! записывается с помощью сетера класса ThemoviedbApiService в переменную searchQuery
    themoviedbApiService.query = evt.currentTarget.elements.searchQuery.value.trim(); //! + убираем пробелы
    console.log("searchQuery: ", themoviedbApiService.query); //!

    if (themoviedbApiService.query === "") {
        return alert("Поле ввода не долно быть пустым!");
    }

    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show()
    loadMoreBtn.disable()

    //! Делаем сброс значения page = 1 после submit form 
    //! с помощью метода resetPage из класса ThemoviedbApiService
    themoviedbApiService.resetPage()

    //! Очищаем контейнер при новом вводе данных в input form:
    clearHitsContainer()

    loadMoreBtn.disable()
    //? Делаем ОБЩИЙ fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
    themoviedbApiService.fetchHits()
        .then(({ totalHits, hits, endOfCollection }) => {
            // console.log("totalHits: ", totalHits); //!
            // console.log("hits: ", hits); //!
            // console.log("endOfCollection: ", endOfCollection); //!

            //! ПРОВЕРКА hits на пустой массив 
            checkHitsForEmpty(hits)

            showsTotalHits(totalHits) //* Консолим свойство totalHits
            return hits
        })
        .then(hits => {
            appendHitsMarkup_OLD(hits); //* Рисование интерфейса выносим в отдельную ф-цию
            loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
            gallery.refresh();  //? Использование библиотеки SimpleLightbox:
        });
};
//! +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//! ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE ++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
function onLoadMore(evt) {
    loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем
    //? Делаем fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
    themoviedbApiService.fetchHits()
        .then(({ totalHits, hits, endOfCollection }) => {
            // console.log("totalHits: ", totalHits); //!
            // console.log("hits: ", hits); //!

            //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
            checkHitsForEnd(endOfCollection)
            return hits
        })
        // .then(appendHitsMarkup); // Рисование интерфейса выносим в отдельную ф-цию
        .then(hits => {
            appendHitsMarkup_OLD(hits); //* Рисование интерфейса выносим в отдельную ф-цию
            loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
            gallery.refresh();  //? Использование библиотеки SimpleLightbox:
        });
}
//! +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//?  Ф-ция, к-рая  прверяет hits на пустой массив:
function checkHitsForEmpty(hits) {
    // console.log(hits[0]); //!
    if (hits[0] === undefined) {
        Notiflix.Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
}




//! Ф-ция, к-рая проверяет hits на ОКОНЧАНИЕ КОЛЛЕКЦИИ
function checkHitsForEnd(endOfCollection) {
    if (endOfCollection <= 0) {
        Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
}



//!   Ф-ция, к-рая очищает контейнер при новом вводе данных в input form:
function clearHitsContainer() {
    refs.imageCards.innerHTML = "";
}



//*   Ф-ция, к-рая консолит свойство totalHits:
function showsTotalHits(totalHits) {
    if (totalHits > 0)
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, { timeout: 3000, },);;
}


//! +++++++++++++++++++++++++++++ Markup ++++++++++++++++++++++++++++++++++++++++++++++++++++
//todo  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendHitsMarkup(results) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.imageCards.insertAdjacentHTML('beforeend', createImageCardsMarkup(results));
    // console.log(hits[0].largeImageURL); //! ссылка на большое изображение
}


//todo   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки:
function createImageCardsMarkup(results) {
    return results
        .map(({ id, poster_path, title, name, genre_ids, first_air_date, release_date }) => {

            //? Получаем массив жанров для каждого фильма и строку всех жанров:
            const genresAllOneFilmArray = genre_ids.map(id => convertingIdToGenre(id)); //! массив жанров для каждого фильма
            // console.log("genresOneFilm:", genresAllOneFilmArray); //!
            const genresAllOneFilm = genresAllOneFilmArray.join(", "); //! строка всех жанров
            // console.log("genresAllOneFilm:", genresAllOneFilm); //!

            //? Получаем значение года из строки даты:
            const date = first_air_date || release_date;
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





//todo  +++++++++++++++++++++++++++++ Markup ++++++++++++++++++++++++++++++++++++++++++++++++++++
//todo  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendHitsMarkup_OLD(results) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.imageCards.insertAdjacentHTML('beforeend', createImageCardsMarkup_OLD(results));
    // console.log(hits[0].largeImageURL); //! ссылка на большое изображение
}


//todo   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки:
function createImageCardsMarkup_OLD(hits) {
    return hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
                <div class="photo-card">
                        <a class="gallery__link" href="${largeImageURL}">
                            <img class="img-card"
                                src="${webformatURL}"
                                alt=${tags}
                                loading="lazy" 
                            /> 
                        </a>
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                            <b class="info-data">${likes}</b>
                        </p>
                        <p class="info-item">
                            <b>Views</b>
                            <b class="info-data">${views}</b>
                        </p>
                        <p class="info-item">
                            <b>Comments</b>
                            <b class="info-data">${comments}</b>
                        </p>
                        <p class="info-item">
                            <b>Downloads</b>
                            <b class="info-data">${downloads}</b>
                        </p>
                    </div>
                </div>
            `;
        })
        .join('');
}