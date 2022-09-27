// import './css/styles.css';

import Notiflix from 'notiflix';

//! Импорт класса ThemoviedbApiService с ./js/get-refs.js
import ThemoviedbApiService from './js/api-themoviedb.js';

//! Импорт всех ссылок с ./js/get-refs.js
import getRefs from './js/get-refs.js';

//! Импорт класса LoadMoreBtn Кнопки LOAD MORE
import LoadMoreBtn from './js/load-more-btn.js';

//! Импорт массива объектов всех жанров из файла genres.js (ВРЕМЕННО. Надо сделать два запроса)
import { genres } from './js/genres.js'; //? api-themoviedb





//* +++++++++++++++++++++++++++++++++++ Импорты файлов ++++++++++++++++++++++++++++++++++++++++++++

//! Создаем объект всех ссылок refs.*
const refs = getRefs();

//! Создаем экземпляр класса ThemoviedbApiService
const themoviedbApiService = new ThemoviedbApiService();

//! Создаем экземпляр класса LoadMoreBtn = Кнопка LOAD MORE
const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more1"]',
    hidden: true,
});





//* +++++++++++++++++++++++++++++++ Создаем ВСЕХ слушателей +++++++++++++++++++++++++++++++++++++++++

//!  Создаем слушателя событий на поле ввода данных - input form:
refs.searchForm.addEventListener('submit', onFormMoviesSearch);

//!  Создаем слушателя событий на кнопке LOAD MORE:
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

//! Создаем слушателя событий на кнопке HOME:
refs.homeBtn.addEventListener('click', onHome);

//! Создаем слушателя событий на кнопке Filmoteka:
refs.filmotekaBtn.addEventListener('click', onHome);

//! Создаем слушателя событий на кнопке Filmoteka:
refs.myLibraryBtn.addEventListener('click', onMyLibrary);


//! Создаем слушателя событий на <section class="section-hero"> ==> на poster_path:
refs.movieDetails.addEventListener('click', onMovieDetails);

//? +++++++++++++++++++ Создаем слушателей для МОДАЛКИ ++++++++++++++++++++++++
// refs.openModalBtn.addEventListener('click', onOpenModal); //? ----- для тестирования
refs.closeModalBtn.addEventListener('click', onCloseModal);
refs.backdrop.addEventListener('click', onBackdropClick);

//? ++++++++++++++++++ ПОКАЗЫВАЕМ/ПРЯЧЕМ элементы разметки ++++++++++++++++++++
//! ПОКАЗЫВАЕМ форму со строкой инпута:
// refs.searchFormAlert.hidden = true; //! ПРЯЧЕМ
refs.searchFormAlert.hidden = false; //! ПОКАЗЫВАЕМ

//! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
refs.resultNotSuccessful.hidden = true;

//! ПРЯЧЕМ блок кнопок WATCHED и QUEUE в header:
refs.watchedQueueHeader.hidden = true;





//* +++++++++++++++++++++++++++++++ Создаем ГЛОБАЛЬНЫЕ переменные +++++++++++++++++++++++++++++++++++++++++

//! Создаем глобальную переменную (films) для хранения значение всей (results)
let films = [];

//! Создаем глобальную переменную (idFilms) для хранения idF одного фильма
let idFilms = 0;

//! Создаем глобальную переменную (infoFilm) для хранения полной информации об одном фильме
let infoFilm = null;


//! Переменная для определения типа запроса в кнопке LOAD MORE 
let currentPage = "";





//* +++++++++++++++++++++++++++++++++++++++ Блок Функций  +++++++++++++++++++++++++++++++++++++++++++++++++

//? Тестируем-консолим тип жанра по его id
// console.log("genres:", genres); //!
// const genreName = convertingIdToGenre(10770);
// console.log("genreName:", genreName); //!



//!!!!!! Загрузка популярных фильмов на главную (первую) страницу (без нажатия на кнопки HOME или Filmoteka)
onHome();

//todo ПРОВЕКА на ВЕРХНИЙ регистр (пока не удалять)
// const title1 = "Fullmetal Alchemist: The Final Alchemy"
// const capitalsTitle = title1.toLocaleUpperCase();
// console.log("capitalsTitle:", capitalsTitle); //!

//* -------------------------- Ф-ция-запрос_1, к-рая прослушивает события на кнопке HOME: ----------------------
//! +++ Загрузка популярных фильмов на главную (первую) страницу  +++
async function onHome() {
    //! Задаем значение переменной (currentPage = "home-Filmoteka") для определения типа запроса в кнопке LOAD MORE
    currentPage = "home-Filmoteka";

    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! ПОКАЗЫВАЕМ форму со строкой инпута:
    refs.searchFormAlert.hidden = false; //! ПОКАЗЫВАЕМ

    //! ПРЯЧЕМ блок кнопок WATCHED и QUEUE в header:
    refs.watchedQueueHeader.hidden = true;

    //! Делаем сброс значения page = 1 после submit form 
    //! с помощью метода resetPage из класса ThemoviedbApiService
    themoviedbApiService.resetPage();

    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show()
    loadMoreBtn.disable();

    //! Очищаем контейнер:
    clearMovieContainer();

    //! Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
    const results = await themoviedbApiService.getTrendingAllDay();

    //! Перезаписываем в глобальную переменную (films) значение всей (results)
    films = results;

    //? ------- Получаем и консолим все данные для рендера разметки главной страницы -------
    // console.log("results:", results); //!
    // results.map(result => {
    //     console.log("id:", result.id); //!

    //     console.log("poster_path:", result.poster_path);

    //     // console.log("title or name:", result.title || result.name); //* работает, можно так
    //     const titleOrName = result.title || result.name;
    //     const capitalsTitle = result.title.toUpperCase(); //!!!(НЕ РАБОТАЕТ!!!)
    //     console.log("titleOrName:", titleOrName);
    //     console.log("capitalsTitle:", capitalsTitle); //!!!(НЕ РАБОТАЕТ!!!)

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
};



//* ---------- Ф-ция-запрос_2, к-рая прослушивает события на поле ввода данных - input form:-------
//! ++++++++++ Поиск кинофильма по ключевому слову из input form +++++++++++
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
    clearMovieContainer();

    //! Делаем ОБЩИЙ fetch-запрос с помощью метода .fetchHits из класса ThemoviedbApiService
    const results = await themoviedbApiService.getSearchMovies();
    // console.log("results:", results); //!

    //! Перезаписываем в глобальную переменную (films) значение всей (results)
    films = results;

    //! ПРОВЕРКА hits на пустой массив
    checkMovieForEmpty(results);

    //! Рисование интерфейса
    appendHitsMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();
};




//* -------------------------- Ф-ция-запрос_3, к-рая запрашивает полную информацию об одном фильме: ----------------------
//! +++ Запрос полной информации о фильме для МОДАЛКИ +++
async function onMovieDetails(event) {
    // console.log("Вешаю слушателя на onMovieDetails"); //!
    if (event.target.src) {
        //! Получаем (id) фильма по клику на карточке фильма
        // console.log("event.target.src: ", event.target.src); //!
        const allPosterPath = String(event.target.src);
        // alert(typeof allPosterPath); // string //!
        // console.log("allPosterPath:", allPosterPath); //!
        const posterPath = allPosterPath.substring(31);
        // console.log("posterPath:", posterPath); //!

        // console.log("films:", films); //!

        const i = films.findIndex(film => film.poster_path === posterPath)
        // console.log("i:", i); //!
        idFilms = films[i].id; //! id фильма
    } else return;

    console.log("idFilms:", idFilms); //! id фильма

    //! ==> Делаем запрос-3 полной информации о фильме для МОДАЛКИ.
    try {
        const results = await themoviedbApiService.getMovieDetails(idFilms);
        //! Очищаем контейнер МОДАЛКИ:
        clearModalContainer();
        //! Перезаписываем в глобальную переменную (films) значение всей (results)
        infoFilm = results;
    } catch (error) {
        //! Очищаем контейнер МОДАЛКИ:
        clearModalContainer();
        //! Очищаем контейнер переменную (films):
        infoFilm = null;
        console.log(error); //!
        Notiflix.Notify.failure(`Ошибка запроса: ${error.message}`, { timeout: 3500, },);
    }
    //? ------- Получаем и консолим все данные для рендера разметки главной страницы -------
    // console.log("getMovieDetails ==> infoFilm:", infoFilm); //!
    // const titleOrName = infoFilm.title || infoFilm.name;
    // console.log("titleOrName:", titleOrName);
    // console.log("id:", infoFilm.id); //!
    // console.log("poster_path:", infoFilm.poster_path);
    // console.log("Vote:", infoFilm.vote_average);
    // console.log("Votes:", infoFilm.vote_count);
    // console.log("Popularity:", infoFilm.popularity);
    // const originalTitleOrName = infoFilm.original_title || infoFilm.original_name;
    // console.log("Original Title:", originalTitleOrName);
    // const genresAllOneFilm = infoFilm.genres.map(item => item.name).join(", ");
    // console.log("Genre:", genresAllOneFilm); //! строка всех жанров
    // console.log("About:", infoFilm.overview);
    //?_________________КОНЕЦ Получения и консоли всех данных _____________________

    //! ==> Открываем модалку
    window.addEventListener('keydown', onEscKeyPress);
    document.body.classList.add('show-modal');

    //! Рисование интерфейса 
    appendInfoMovieMarkup(infoFilm);
};




//* -------------------------- Ф-ция-запрос_4, для работы с MY LIBRARY: ----------------------
function onMyLibrary() {
    // console.log("Вешаю слушателя на кнопку MY LIBRARY"); //!
    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! ПРЯЧЕМ форму со строкой инпута:
    refs.searchFormAlert.hidden = true;

    //! ПОКАЗЫВАЕМ блок кнопок WATCHED и QUEUE в header:
    refs.watchedQueueHeader.hidden = false;

    //! Кнопка LOAD MORE => ПРЯЧЕМ
    loadMoreBtn.hide();

    //! Очищаем контейнер:
    clearMovieContainer();
}




//todo ==> РАБОТАЕТ, но только под один тип запроса (уже не используется)
// ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE (для Ф-ции-запрос_1) ++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
// async function onLoadMore(evt) {
//     loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем


//     //! Делаем fetch-запрос с помощью метода .getTrendingAllDay из класса ThemoviedbApiService
//     const results = await themoviedbApiService.getTrendingAllDay();

//     //! Перезаписываем в глобальную переменную (films) значение всей (results)
//     films = results;

//     //! Очищаем контейнер:
//     clearMovieContainer();

//     //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
//     // checkResultsForEnd(endOfCollection);

//     //! Рисование интерфейса
//     appendHitsMarkup(results);

//     //! Кнопка LOAD MORE => включаем
//     loadMoreBtn.enable();
// }
//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//* ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE (для Ф-ции-запрос ==> ОБЩАЯ - для 1 и 2) ++++++++++++++++++++++++++++++++++++++++++++
//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
async function onLoadMore() {

    //! Кнопка LOAD MORE => ВЫключаем
    loadMoreBtn.disable()

    //! проверяеm значения переменной (currentPage) 
    //! и СРАЗУ получаем в переменной films нужный массив объектов 
    //! для отрисовки следующих 20 фильмов
    await checkResults();

    // console.log("onLoadMore ==> films:", films); //!

    //! Очищаем контейнер:
    clearMovieContainer();

    //!  Проверка results на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
    // checkResultsForEnd(endOfCollection);

    //! Рисование интерфейса
    appendHitsMarkup(films);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();
};
//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//* --------------------------- themoviedb-Функции ---------------------
//?   Ф-ция, к-рая проверяет значения переменной (currentPage) для определения типа запроса в кнопке LOAD MORE
async function checkResults() {
    if (currentPage === "home-Filmoteka") {
        const results = await themoviedbApiService.getTrendingAllDay();
        films = results;
        // console.log("home-Filmoteka ==> films:", films); //!
    } else {
        if (currentPage === "Movie search") {
            const results = await themoviedbApiService.getSearchMovies();
            films = results;
            // console.log("Movie search ==> films:", films); //!
        } else {
            return;
        }
    };
};



//!  Ф-ция, к-рая получает id жанра и возвращает тип жанра
function convertingIdToGenre(id) {
    const genre = genres.filter(genre => genre.id === id);
    // console.log("genre:", genre); //! 
    // console.log("genre[0].name:", genre[0].name); //!
    return genre[0].name;
};



//!  Ф-ция, к-рая очищает контейнер при новом вводе данных в input form:
function clearMovieContainer() {
    refs.moviesCards.innerHTML = "";
};



//!  Ф-ция, к-рая очищает контейнер МОДАЛКИ:
function clearModalContainer() {
    refs.InfoMovie.innerHTML = "";
};



//!  Ф-ция, к-рая  прверяет results на пустой массив:
function checkMovieForEmpty(results) {
    if (!results.length) {
        //! ПОКАЗЫВАЕМ строку предупреждения об отсутствии фильмов:
        refs.resultNotSuccessful.hidden = false;
        // Notiflix.Notify.failure(`Search result not successful. Enter the correct movie name and`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
};


//? +++++++++++++++++++++++ Функции для МОДАЛКИ +++++++++++++++++++++++++++
//? ----- для тестирования открытия модалки по кнопке
// function onOpenModal() {
//     window.addEventListener('keydown', onEscKeyPress);
//     document.body.classList.add('show-modal');
// }

function onCloseModal() {
    window.removeEventListener('keydown', onEscKeyPress);
    document.body.classList.remove('show-modal');
    //! Очищаем контейнер МОДАЛКИ:
    clearModalContainer();
}

function onBackdropClick(event) {
    // console.log(event.currentTarget); //!
    // console.log(event.target); //!
    if (event.currentTarget === event.target) {
        // console.log('Кликнули именно в бекдроп!!!!'); //!
        onCloseModal();
    }
};

function onEscKeyPress(event) {
    // console.log(event.code); //!
    // const ESC_KEY_CODE = 'Escape';
    // const isEscKey = event.code === ESC_KEY_CODE;
    // if (isEscKey) {
    if (event.code === 'Escape') {
        onCloseModal();
    }
}
//?_____________________________________________________________________







//! +++++++++++++++++++++++++++++ Markup Movies ++++++++++++++++++++++++++++++++++++++++++++++
//*  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendHitsMarkup(results) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.moviesCards.insertAdjacentHTML('beforeend', createMoviesCardsMarkup(results));
}

//! --------------------------------------------------------------------------------------------
//*   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки из ВСЕХ карточек:
function createMoviesCardsMarkup(results) {
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

            //? Делаем заглавныее буквы в названии фильма (пока НЕ РАБОТАЕТ capitalsName)
            let capitalsTitle = title;
            if (title) {
                capitalsTitle = title.toUpperCase();
                // const title = title.toUpperCase();
                // console.log("capitalsTitle:", capitalsTitle); //!
            };

            let capitalsName = name;
            if (name) {
                const capitalsName = name.toUpperCase();
                // const name = name.toUpperCase();
                // console.log("capitalsName:", capitalsName); //!
            };
            // console.log(typeof title); //!
            // const capitalsTitle = title.toLocaleUpperCase();
            // const capitalsTitle = title.toUpperCase();
            // console.log("capitalsTitle:", capitalsTitle); //!
            // const capitalsName = name.toUpperCase();

            return `
                <li key=${id}>
                    <img src="https://image.tmdb.org/t/p/w780${poster_path}" alt="${title || name}" />

                    <div>
                        <br />
                        <h5>${capitalsTitle || capitalsName}</h5>
                        <h5>${genresAllOneFilm} | ${yearDate}</h5>
                    </div>
                </li>
                `;
        })
        .join('');
};



//! +++++++++++++++++++++++++++++ Markup infoFilm ++++++++++++++++++++++++++++++++++++++++++++++
//*  Ф-ция-then, к-рая отрисовывает интерфейс ОДНОГО фильма в МОДАЛКЕ:
function appendInfoMovieMarkup(infoFilm) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.InfoMovie.insertAdjacentHTML('afterbegin', createInfoMovieMarkup(infoFilm));
};

//! --------------------------------------------------------------------------------------------
//*   Ф-ция, к-рая создает новую разметку ОДНОГО фильма в МОДАЛКЕ:
function createInfoMovieMarkup(infoFilm) {
    // console.log("createInfoMovieMarkup ==> infoFilm:", infoFilm); //!
    const {
        id,
        poster_path,
        title, name,
        vote_average,
        vote_count,
        popularity,
        original_title,
        original_name,
        genres,
        overview
    } = infoFilm

    //? Получаем строку со всеми жанрами
    const genresAllOneFilm = genres.map(item => item.name).join(", ");

    //? Делаем заглавныее буквы в названии фильма (пока НЕ РАБОТАЕТ capitalsName)
    let capitalsTitle = title;
    if (title) {
        capitalsTitle = title.toUpperCase();
        // const title = title.toUpperCase();
        // console.log("capitalsTitle:", capitalsTitle); //!
    };

    let capitalsName = name;
    if (name) {
        const capitalsName = name.toUpperCase();
        // const name = name.toUpperCase();
        // console.log("capitalsName:", capitalsName); //!
    };

    return `
                <img src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${title || name}" />

                <div class="modal-сontent">
                    <h3>${capitalsTitle || capitalsName}</h3>
                    <h5>Vote/Votes ${vote_average}/${vote_count}</h5>
                    <h5>Popularity ${popularity}</h5>
                    <h5>Original Title ${original_title || original_name}</h5>
                    <h5>Genre ${genresAllOneFilm}</h5>
                    <h5>ABOUT</h5>
                    <p>${overview}</p>
                </div>
                `;
};



//todo ------------------------- OLD-Функции (пока не удалять)------------------------------------
//? Ф-ция, к-рая проверяет hits на ОКОНЧАНИЕ КОЛЛЕКЦИИ
// function checkResultsForEnd(endOfCollection) {
//     if (endOfCollection <= 0) {
//         Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`, { timeout: 3000, },);
//         loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
//     }
// }


//?   Ф-ция, к-рая консолит свойство totalResults:
// function showsTotalResults(totalResults) {
//     if (totalResults > 0)
//         Notiflix.Notify.success(`Hooray! We found ${totalResults} images.`, { timeout: 3000, },);
// }
//todo __________________________________________________________________________