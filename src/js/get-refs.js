export default function getRefs() {
  return {
    //! Получаем ссылку на input form:
    // searchForm: document.querySelector('#search-form'), //todo OLD
    searchForm: document.querySelector('form[data-action="search-form"]'),

    //! Получаем ссылку на div-контейнер для разметки карточек изображений:
    // moviesCards: document.querySelector('.gallery'), //todo OLD
    moviesCards: document.querySelector('ul[data-action="movies-cards"]'),

    //! Получаем ссылку на div-контейнер для разметки карточек изображений:
    // InfoMovie: document.querySelector('.modal-markup'), //todo OLD
    InfoMovie: document.querySelector('div[data-action="modal-markup"]'),

    //! Получаем ссылку на кнопку HOME:
    // homeBtn: document.querySelector('.button-home'), //todo OLD
    homeBtn: document.querySelector('button[data-action="button-home"]'),

    //! Получаем ссылку на кнопку Filmoteka:
    // filmotekaBtn: document.querySelector('.button-filmoteka'), //todo OLD
    filmotekaBtn: document.querySelector('button[data-action="button-filmoteka"]'),

    //! Получаем ссылку на кнопку MY LIBRARY:
    // myLibraryBtn: document.querySelector('.button-mylibrary'), //todo OLD
    myLibraryBtn: document.querySelector('button[data-action="button-mylibrary"]'),

    //! Получаем ссылку на <section class="section-hero"> ==> на poster_path:
    // movieDetails: document.querySelector('.section-hero'), //todo OLD
    movieDetails: document.querySelector('section[data-action="section-hero"]'),

    //! Получаем ссылки для модалки:
    // openModalBtn: document.querySelector('[data-action="open-modal"]'), //! ----- для тестирования
    closeModalBtn: document.querySelector('[data-action="close-modal"]'),
    backdrop: document.querySelector('.js-backdrop'),

    //! Получаем ссылку на строку предупреждения об отсутствии фильмов:
    // resultNotSuccessful: document.querySelector('.search-alert'), //todo OLD
    resultNotSuccessful: document.querySelector('[data-action="search-alert"]'),


    //! Получаем ссылку на форму со строкой инпута:
    // searchFormAlert: document.querySelector('.search'), //todo OLD
    searchFormAlert: document.querySelector('div[data-action="search-form-alert"]'),

    //! Получаем ссылку на блок кнопок WATCHED и QUEUE в header:
    watchedQueueHeader: document.querySelector('.nav-library-buttons'),

    //! Получаем ссылку на кнопоку ADD TO WATCHED в МОДАЛКЕ:
    // watchedModal: document.querySelector('.modal-watched'), //todo OLD
    watchedModal: document.querySelector('button[data-action="modal-add-watched"]'),

    //! Получаем ссылку на кнопоку DELETE FROM WATCHED в МОДАЛКЕ:


    //! Получаем ссылку на кнопоку ADD TO QUEUE в МОДАЛКЕ:
    // queueModal: document.querySelector('.modal-queue'), //todo OLD
    queueModal: document.querySelector('button[data-action="modal-add-queue"]'),

    //! Получаем ссылку на кнопоку DELETE FROM QUEUE в МОДАЛКЕ:


    //! Получаем ссылку на кнопоку WATCHED в header:
    // watchedHeader: document.querySelector('.nav-library-watched'), //todo OLD
    watchedHeader: document.querySelector('[data-action="library-watched"]'),

    //! Получаем ссылку на кнопоку QUEUE в header:
    // queueHeader: document.querySelector('.nav-library-queue'), //todo OLD
    queueHeader: document.querySelector('[data-action="library-queue"]'),
  };
};

