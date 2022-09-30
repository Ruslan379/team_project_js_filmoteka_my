// import './css/styles.css';

import Notiflix from 'notiflix';

//! Импорт класса ThemoviedbApiService с ./js/get-refs.js
import ThemoviedbApiService from './js/api-themoviedb.js';

//! Импорт всех ссылок с ./js/get-refs.js
import getRefs from './js/get-refs.js';

//! Импорт класса LoadMoreBtn Кнопки LOAD MORE
import LoadMoreBtn from './js/load-more-btn.js';

//! Импорт массива объектов всех жанров из файла genres.js (ВРЕМЕННО. Надо сделать два запроса)
import { genres } from './js/genres.js';





//* +++++++++++++++++++++++++++++++++++ Импорты файлов ++++++++++++++++++++++++++++++++++++++++++++

//! Создаем объект всех ссылок refs.*
const refs = getRefs();
// console.log("refs:", refs); //!

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

//! Создаем слушателя событий на кнопке MY LIBRARY:
refs.myLibraryBtn.addEventListener('click', onMyLibraryWatched);


//! Создаем слушателя событий на <section class="section-hero"> ==> на poster_path:
refs.movieDetails.addEventListener('click', onMovieDetails);

//! +++++++++++++++++++ Создаем слушателей для МОДАЛКИ ++++++++++++++++++++++++
// refs.openModalBtn.addEventListener('click', onOpenModal); //? ----- для тестирования
refs.closeModalBtn.addEventListener('click', onCloseModal);
refs.backdrop.addEventListener('click', onBackdropClick);

//! +++++++++ Создаем слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ ++++++++++++++
// refs.watchedModal.addEventListener('click', onWatchedModal); //!!! +-+-+-+-
// refs.queueModal.addEventListener('click', onQueueModal); //!!! +-+-+-+-
console.log("Слушатели_refs.watchedModal:", refs.watchedModal); //!
console.log("Слушатели_refs.queueModal:", refs.queueModal); //!
//! Импортируем ГОТОВЫХ слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ 
// import addIventListenerModalBtn from './js/addIventListenerModalBtn.js'; //! пока не надо, поключена ЛОКАЛЬНО

//! ++++ Создаем слушателей на кнопках WATCHED и QUEUE для страницы MY LIBRARY +++++++
refs.watchedHeader.addEventListener('click', onMyLibraryWatched);
refs.queueHeader.addEventListener('click', onQueue);



//! ++++++++++++++++++ ПОКАЗЫВАЕМ/ПРЯЧЕМ элементы разметки ++++++++++++++++++++
//? ПОКАЗЫВАЕМ форму со строкой инпута:
// refs.searchFormAlert.hidden = true; //! ПРЯЧЕМ
refs.searchFormAlert.hidden = false; //! ПОКАЗЫВАЕМ

//? ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
refs.resultNotSuccessful.hidden = true;

//? ПРЯЧЕМ блок кнопок WATCHED и QUEUE в header:
refs.watchedQueueHeader.hidden = true;





//* +++++++++++++++++++++++++++++++ Создаем ГЛОБАЛЬНЫЕ переменные +++++++++++++++++++++++++++++++++++++++++

//! Создаем глобальную переменную (films) для хранения значение всей (results)
let films = [];

//! Создаем глобальную переменную (idFilms) для хранения idF одного фильма
let idFilms = 1;

//! Создаем глобальную переменную (infoFilm) для хранения полной информации об одном фильме
let infoFilm = null;


//! Переменная для определения типа запроса в кнопке LOAD MORE
//! и типа станиц WATCHED и QUEUE
let currentPage = "";

//! Переменные для хранения массива объектов фильмов для станиц WATCHED и QUEUE
let localStorageWatched = JSON.parse(localStorage.getItem("watched")) ?? [];
let localStorageQueue = JSON.parse(localStorage.getItem("queue")) ?? [];




//* +++++++++++++++++++++++++++++++++++++++ Блок Функций  +++++++++++++++++++++++++++++++++++++++++++++++++

//? Тестируем-консолим тип жанра по его id
// console.log("genres:", genres); //!
// const genreName = convertingIdToGenre(10770);
// console.log("genreName:", genreName); //!



//!!!!!! Загрузка популярных фильмов на главную (первую) страницу (без нажатия на кнопки HOME или Filmoteka)
onHome();



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
    //?_________________КОНЕЦ Получения и Консоли всех данных _____________________

    //! Рисование интерфейса 
    appendMoviesMarkup(results);

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
    appendMoviesMarkup(results);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();
};




//* -------------------------- Ф-ция-запрос_3, к-рая запрашивает полную информацию об одном фильме: ----------------------
//! +++ Запрос полной информации о фильме для МОДАЛКИ +++
async function onMovieDetails(event) {
    console.log("Вешаю слушателя на открытие МОДАЛКИ (onMovieDetails)"); //!


    //?+++++++++++++ БЛОК ЛОГИКИ работы кнопок <ADD TO WATCHED> и <ADD TO QUEUE> ++++++++++++++++++
    //! НЕ ТУТ!!!
    //? ___________________________________________________________________________________________

    //? НЕ ТАК...
    // const liKey = document.getElementsByTagName("li"); //? полуаю массив всех li
    // console.log("liKey[2].getAttribute(key):", liKey[2].getAttribute("key")); //? могу взять НУЖНЫЙ элемент массива и его id;
    //? и НЕ ТАК...
    // const liKey = document.querySelector("li");
    // console.log("liKey = document.querySelector(li):", liKey); //!
    // const key = liKey.getAttribute("key");
    // console.log("key:", key); //!


    //todo _OLD_ Получение id фильма по клику только на ПОСТЕР
    // if (event.target.src) {
    //     //! Получаем (id) фильма по клику на карточке фильма
    //     // console.log("event.target.src: ", event.target.src); //!
    //     const allPosterPath = String(event.target.src);
    //     // alert(typeof allPosterPath); // string //!
    //     // console.log("allPosterPath:", allPosterPath); //!
    //     const posterPath = allPosterPath.substring(31);
    //     // console.log("posterPath:", posterPath); //!

    //     // console.log("films:", films); //!

    //     const i = films.findIndex(film => film.poster_path === posterPath)
    //     // console.log("i:", i); //!
    //     idFilms = films[i].id; //! id фильма
    // } else return;

    // console.log("idFilms:", idFilms); //! id фильма
    //todo ________________________________________________


    //!!!!!!!! УРА, ПОЛУЧИЛОСЬ взять id фильма по клику !!!!!!!!!!!!!!!
    //? Как узнать номер li, на котором сделан клик
    // let idFilms = 1;
    if (event.target.closest("li")) {
        const itemId = event.target.closest("li");
        // console.log("itemId:", itemId); //!
        idFilms = Number(itemId.getAttribute("key")); //!!! вот ОН, РОДНОЙ!!!
        console.log("idFilms:", idFilms); //!
    } else return;
    //!!!!!!!! УРА, ПОЛУЧИЛОСЬ взять id фильма по клику !!!!!!!!!!!!!!!


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

    //! Добавляем ГОТОВЫХ слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ
    addIventListenerModalBtn();

    //! Вызываем БЛОК ЛОГИКИ работы кнопок <ADD TO WATCHED> и <ADD TO QUEUE> 
    operationLogicWatchedQueue();
};




//* -------------- Ф-ция_4, ДОБАВЛЕНИЕ/УДАЛЕНИЕ просмотренных фильмов в localStorage по кноке ADD TO WATCHED: ----------
//! +++ Запрос полной информации о фильме для МОДАЛКИ +++
function onWatchedModal() {
    console.log("Вешаю слушателя на кнопку ADD TO WATCHED в МОДАЛКЕ"); //!

    console.log("infoFilm:", infoFilm); //!
    console.log("infoFilm.id:", infoFilm.id); //!

    console.log("Ф-ция_4_refs.watchedModal ==>:", refs.watchedModal); //!

    const textWatchedModal = refs.watchedModal.textContent;
    console.log("textWatchedModal ==> начало:", textWatchedModal); //!

    if (textWatchedModal === "ADD TO WATCHED") {
        //! Блокировка повторной записи фильма в localStorage (ВРЕМЕННО)
        if (localStorageWatched.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в WATCHED`, { timeout: 3500, },);
            refs.watchedModal.textContent = "DELETE FROM WATCHED";
            if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
            if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");
            return;
        };
        //! Запись фильма в localStorage
        localStorageWatched = [...localStorageWatched, infoFilm];
        console.log("localStorageWatched:", localStorageWatched); //!
        localStorage.setItem("watched", JSON.stringify(localStorageWatched));
        Notiflix.Notify.success(`Фильм ${infoFilm.title || infoFilm.name} добавлен в WATCHED`, { timeout: 3500, },);
        //! Смена названия (textContent) кнопки на "DELETE FROM WATCHED"
        refs.watchedModal.textContent = "DELETE FROM WATCHED";
        if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
        if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");
        console.log("textWatchedModal ==> конец:", textWatchedModal); //!
    } else {
        if (textWatchedModal === "DELETE FROM WATCHED") {
            localStorageWatched = localStorageWatched.filter(item => item.id !== infoFilm.id);
            localStorage.setItem("watched", JSON.stringify(localStorageWatched));
            console.log("Фильм удален из WATCHED"); //!
            Notiflix.Notify.info(`Фильм ${infoFilm.title || infoFilm.name} удален из WATCHED`, { timeout: 3500, },);
            refs.watchedModal.textContent = "ADD TO WATCHED";
            if (refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.remove("colorRed");
            if (!refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.add("colorGreen");

            if (currentPage === "watched") {
                console.log("currentPage", currentPage); //!
                onCloseModal();
                //! Очищаем контейнер:
                clearMovieContainer();
                appendWatchedQueueMarkup(localStorageWatched);
            };
        };
    };
};




//* ------------------ Ф-ция_5, ДОБАВЛЕНИЕ/УДАЛЕНИЕ просмотренных фильмов в localStorage по кноке ADD TO QUEUE: --------------
//! +++ Запрос полной информации о фильме для МОДАЛКИ +++
function onQueueModal() {
    console.log("Вешаю слушателя на кнопку ADD TO QUEUE в МОДАЛКЕ"); //!

    console.log("infoFilm:", infoFilm); //!
    console.log("infoFilm.id:", infoFilm.id); //!

    const textQueuedModal = refs.queueModal.textContent;
    console.log("textQueuedModal ==> начало:", textQueuedModal); //!

    if (textQueuedModal === "ADD TO QUEUE") {
        //! Блокировка повторной записи фильма в localStorage (ВРЕМЕННО)
        if (localStorageQueue.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в QUEUE`, { timeout: 3500, },);
            refs.queueModal.textContent = "DELETE FROM QUEUE";
            if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
            if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
            return;
        };
        //! Запись фильма в localStorage
        localStorageQueue = [...localStorageQueue, infoFilm];
        console.log("localStorageQueue:", localStorageQueue); //!
        localStorage.setItem("queue", JSON.stringify(localStorageQueue));
        Notiflix.Notify.success(`Фильм ${infoFilm.title || infoFilm.name} добавлен в QUEUE`, { timeout: 3500, },);
        //! Смена названия (textContent) кнопки на "DELETE FROM QUEUE"
        refs.queueModal.textContent = "DELETE FROM QUEUE";
        if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
        if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
        console.log("textQueuedModal ==> конец:", textQueuedModal); //!
    } else {
        if (textQueuedModal === "DELETE FROM QUEUE") {
            localStorageQueue = localStorageQueue.filter(item => item.id !== infoFilm.id);
            localStorage.setItem("queue", JSON.stringify(localStorageQueue));
            console.log("Фильм удален из QUEUE");
            Notiflix.Notify.info(`Фильм ${infoFilm.title || infoFilm.name} удален из QUEUE`, { timeout: 3500, },);
            refs.queueModal.textContent = "ADD TO QUEUE";
            if (refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.remove("colorRed");
            if (!refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.add("colorGreen");
            if (currentPage === "queue") {
                console.log("currentPage", currentPage); //!
                onCloseModal();
                //! Очищаем контейнер:
                clearMovieContainer();
                appendWatchedQueueMarkup(localStorageQueue);
            };
        };
    };
};




//* -------------------------- Ф-ция_6, для работы с MY LIBRARY или кнопкой WATCHED: ----------------------
function onMyLibraryWatched() {
    console.log("Вешаю слушателя на кнопку MY LIBRARY==>WATCHED"); //!

    // refs.watchedModal.textContent = "DELETE FROM WATCHED";
    //! Назначаем тип станицы WATCHED для логики работы кнопок МОДАЛКИ
    currentPage = "watched";

    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! ПРЯЧЕМ форму со строкой инпута:
    refs.searchFormAlert.hidden = true;

    //! ПОКАЗЫВАЕМ блок кнопок WATCHED и QUEUE в header:
    refs.watchedQueueHeader.hidden = false;

    //! Кнопка LOAD MORE => показываем и отключаем
    // loadMoreBtn.show();
    loadMoreBtn.hide(); //! Временно => ПРЯЧЕМ
    loadMoreBtn.disable();

    //! Очищаем контейнер:
    clearMovieContainer();

    //! Перезаписываем в локальную переменную (results) значение всего (localStorage)
    const results = JSON.parse(localStorage.getItem("watched")) ?? [];
    console.log("results:", results); //!

    //! Рисование интерфейса 
    appendWatchedQueueMarkup(results);

    //! Кнопка LOAD MORE => включаем
    // loadMoreBtn.enable();
};




//* -------------------------- Ф-ция_7, для работы с кнопкой QUEUEв MY LIBRARY : ----------------------
function onQueue() {
    console.log("Вешаю слушателя на кнопку MY LIBRARY==>QUEUE"); //!

    //! Назначаем тип станицы QUEUE для логики работы кнопок МОДАЛКИ
    currentPage = "queue";

    //! ПРЯЧЕМ строку предупреждения об отсутствии фильмов:
    refs.resultNotSuccessful.hidden = true;

    //! ПРЯЧЕМ форму со строкой инпута:
    refs.searchFormAlert.hidden = true;

    //! ПОКАЗЫВАЕМ блок кнопок WATCHED и QUEUE в header:
    refs.watchedQueueHeader.hidden = false;

    //! Кнопка LOAD MORE => показываем и отключаем
    // loadMoreBtn.show();
    loadMoreBtn.hide(); //! Временно => ПРЯЧЕМ
    loadMoreBtn.disable();

    //! Очищаем контейнер:
    clearMovieContainer();

    //! Перезаписываем в локальную переменную (results) значение всего (localStorage)
    const results = JSON.parse(localStorage.getItem("queue")) ?? [];
    console.log("results:", results); //!

    //! Рисование интерфейса 
    appendWatchedQueueMarkup(results);

    //! Кнопка LOAD MORE => включаем
    // loadMoreBtn.enable();
};



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
//     appendMoviesMarkup(results);

//     //! Кнопка LOAD MORE => включаем
//     loadMoreBtn.enable();
// }
//todo +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




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
    appendMoviesMarkup(films);

    //! Кнопка LOAD MORE => включаем
    loadMoreBtn.enable();
};
//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//* ---------------------------------------------- Функции-вызывалки ----------------------------------------------
//! ++++++++++++++ Ф-ция, к-рая проверяет значения переменной (currentPage) для определения типа запроса в кнопке LOAD MORE ++++++++++++++
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



//! ++++++++++++++ Ф-ция, к-рая получает id жанра и возвращает тип жанра ++++++++++++++
function convertingIdToGenre(id) {
    const genre = genres.filter(genre => genre.id === id);
    // console.log("genre:", genre); //! 
    // console.log("genre[0].name:", genre[0].name); //!
    return genre[0].name;
};



//! ++++++++++++++ Ф-ция, к-рая очищает контейнер при новом вводе данных в input form: ++++++++++++++
function clearMovieContainer() {
    refs.moviesCards.innerHTML = "";
};



//! ++++++++++++++ Ф-ция, к-рая очищает контейнер МОДАЛКИ: ++++++++++++++
function clearModalContainer() {
    refs.InfoMovie.innerHTML = "";
};



//! ++++++++++++++ Ф-ция, к-рая  прверяет results на пустой массив: ++++++++++++++
function checkMovieForEmpty(results) {
    if (!results.length) {
        //! ПОКАЗЫВАЕМ строку предупреждения об отсутствии фильмов:
        refs.resultNotSuccessful.hidden = false;
        // Notiflix.Notify.failure(`Search result not successful. Enter the correct movie name and`, { timeout: 3000, },);
        loadMoreBtn.hide(); //! Кнопка LOAD MORE => ПРЯЧЕМ
    }
};


//! +++++++++++++++++++++++ Функции для МОДАЛКИ +++++++++++++++++++++++++++
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
//!_____________________________________________________________________




//! +++++++++ Создаем слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ ++++++++++++++
function addIventListenerModalBtn() {
    refs.watchedModal = document.querySelector('button[data-action="modal-add-watched"]');
    refs.queueModal = document.querySelector('button[data-action="modal-add-queue"]');

    console.log("addIventListenerModalBtn_refs.watchedModal:", refs.watchedModal); //!
    console.log("addIventListenerModalBtn_refs.queueModal:", refs.queueModal); //!

    refs.watchedModal.addEventListener('click', onWatchedModal);
    refs.queueModal.addEventListener('click', onQueueModal);

    //! -----------------------------------------------------------------------------
    // refs.watchedModal.addEventListener('click', () => {
    //     console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO WATCHED в МОДАЛКЕ"); //!
    // });

    // refs.queueModal.addEventListener('click', () => {
    //     console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO QUEUE в МОДАЛКЕ"); //!
    // });
};



//!+++++++++++++ БЛОК ЛОГИКИ работы кнопок <ADD TO WATCHED> и <ADD TO QUEUE> ++++++++++++++++++
function operationLogicWatchedQueue() {
    console.log("БЛОК ЛОГИКИ_refs.watchedModal ==>:", refs.watchedModal); //!
    console.log("БЛОК ЛОГИКИ_refs.queueModal ==>:", refs.queueModal); //!
    //! Устанвливаем начальные значения textContent для кнопок WATCHED и QUEUE в модалке
    //! в зависимости от того, на какой странице находится пользователь
    refs.watchedModal.textContent = "ADD TO WATCHED";
    if (refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.remove("colorRed");
    if (!refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.add("colorGreen");
    if (currentPage === "watched") {
        refs.watchedModal.textContent = "DELETE FROM WATCHED";
        if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
        if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");

    };
    refs.queueModal.textContent = "ADD TO QUEUE";
    if (refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.remove("colorRed");
    if (!refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.add("colorGreen");
    refs.queueModal.classList.add("colorGreen");
    if (currentPage === "queue") {
        refs.queueModal.textContent = "DELETE FROM QUEUE";
        if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
        if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
    };
}






//* --------------------------------------- Функции-разметки ---------------------------------------------------------
//! +++++++++++++++++++++++++++++ Markup Movies ++++++++++++++++++++++++++++++++++++++++++++++
//*  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendMoviesMarkup(results) {
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

            // let capitalsName = name;
            // if (name) {
            // capitalsName = name.toUpperCase();
            // const capitalsName = name.toUpperCase(); //!!! тут ошибка сделана СПЕЦИАЛЬНО!!!
            // const name = name.toUpperCase();
            // console.log("capitalsName:", capitalsName); //!
            // };

            // console.log(typeof title); //!
            // const capitalsTitle = title.toLocaleUpperCase();
            // const capitalsTitle = title.toUpperCase();
            // console.log("capitalsTitle:", capitalsTitle); //!
            // const capitalsName = name.toUpperCase();

            return `
                <li key=${id}>
                    <img src="https://image.tmdb.org/t/p/w780${poster_path}" alt="${title || name}" />

                    <div>
                    <h2>${capitalsTitle || name}</h2>
                        <h3>${genresAllOneFilm} &nbsp|&nbsp ${yearDate}</h3>
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

    //! Добавляем ГОТОВЫХ слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ
    // addIventListenerModalBtn(); //! НЕ СЮДА!!!
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
        const capitalsName = name.toUpperCase(); //!!! тут ошибка сделана СПЕЦИАЛЬНО!!!
        // const name = name.toUpperCase();
        // console.log("capitalsName:", capitalsName); //!
    };

    return `
        <div class="modal-markup">
            
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

        </div>

        <!--! Кнопки-Markup <ADD TO WATCHED> и <ADD TO QUEUE> -->
        <div class="modal-library">
            <button 
                type="button" 
                class="modal-watched"
                data-action="modal-add-watched"
                >
                ADD TO WATCHED
            </button>
            <button 
                type="button" 
                class="modal-queue"
                data-action="modal-add-queue"
                >
                ADD TO QUEUE
            </button>
        </div>
    `;
};


//! +++++++++++++++++++++++++++++ Markup WATCHED и QUEUE ++++++++++++++++++++++++++++++++++++++++++++++
//*  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendWatchedQueueMarkup(results) {
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.moviesCards.insertAdjacentHTML('beforeend', createWatchedQueueCardsMarkup(results));
};

//! --------------------------------------------------------------------------------------------
//*   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки из ВСЕХ карточек:
function createWatchedQueueCardsMarkup(results) {
    console.log("results:", results);
    return results
        .map(({
            id,
            poster_path,
            title,
            name,
            genres,
            first_air_date,
            release_date,
            vote_average
        }) => {

            //? Получаем строку со всеми жанрами
            const genresAllOneFilm = genres.map(item => item.name).join(", ");
            // console.log("genresAllOneFilm:", genresAllOneFilm); //!

            //? Получаем значение года из строки даты:
            const date = first_air_date || release_date || "???? - ?? - ??";
            // console.log("date:", date); //!
            const yearDate = date.substr(0, 4); //! значение года из строки даты:
            // console.log("yearDate:", yearDate); //!

            //?Убираем лишние знаки после запятой 
            const voteAverage = vote_average.toFixed(1);
            // console.log("voteAverage:", voteAverage); //!

            //? Делаем заглавныее буквы в названии фильма (пока НЕ РАБОТАЕТ capitalsName)
            let capitalsTitle = title;
            if (title) {
                capitalsTitle = title.toUpperCase();
                // const title = title.toUpperCase();
                // console.log("capitalsTitle:", capitalsTitle); //!
            };

            let capitalsName = name;
            if (name) {
                const capitalsName = name.toUpperCase(); //!!! тут ошибка сделана СПЕЦИАЛЬНО!!!
                // const name = name.toUpperCase();
                // console.log("capitalsName:", capitalsName); //!
            };


            return `
                <li key=${id}>
                    <img src="https://image.tmdb.org/t/p/w780${poster_path}" alt="${title || name}" />

                    <div>
                        <h2>${capitalsTitle || capitalsName}</h2>
                        <h3>${genresAllOneFilm} &nbsp|&nbsp ${yearDate}&nbsp &nbsp${voteAverage}</h3>
                    </div>
                </li>
                `;
        })
        .join('');
};






//todo ----------- Попытка создать кнопку DELETE FROM WATCHED (пока не получилось) ---------
// //! Замена атрибута "data-action" на "modal-delete-watched" (РАБОТАТ с ОШИБКОЙ!!!)
// refs.watchedAddModal.setAttribute("data-action", "modal-delete-watched");
// console.log("refs.watchedAddModal:", refs.watchedAddModal.getAttribute("data-action")); //!
// //! Получаем ссылку на кнопоку DELETE FROM WATCHED":
// watchedDeleteModal = document.querySelector('button[data-action="modal-delete-watched"]'), //!!!
// //! Создаем слушателя на новой кнопке "DELETE FROM WATCHED"
// watchedDeleteModal.addEventListener('click', onWatchedDeleteModal); //!!!+++!!!
// //! теперь АКТИВНОЙ становится кнопка "DELETE FROM WATCHED"
//* -------------------------- Ф-ция_5, УДАЛЕНИЕ просмотренных фильмов из localStorage по кноке DELETE FROM WATCHED: ----------------------
function onWatchedDeleteModal() {
    console.log("Вешаю слушателя на кнопку DELETE FROM WATCHED в МОДАЛКЕ"); //!
    // const textWatchedDeleteModal = watchedDeleteModal.textContent;
    // console.log("textWatchedDeleteModal:", textWatchedDeleteModal); //!
}
//todo _____________________________________________________________________________________




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