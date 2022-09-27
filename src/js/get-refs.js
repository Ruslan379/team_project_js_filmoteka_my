export default function getRefs() {
  return {
    //! Получаем ссылку на input form:
    searchForm: document.querySelector('#search-form'),

    //! Получаем ссылку на div-контейнер для разметки карточек изображений:
    moviesCards: document.querySelector('.gallery'),

    //! Получаем ссылку на div-контейнер для разметки карточек изображений:
    InfoMovie: document.querySelector('.modal-markup'),

    //! Получаем ссылку на кнопку HOME:
    homeBtn: document.querySelector('.button-home'),

    //! Получаем ссылку на кнопку Filmoteka:
    filmotekaBtn: document.querySelector('.button-filmoteka'),

    //! Получаем ссылку на кнопку MY LIBRARY:
    myLibraryBtn: document.querySelector('.button-mylibrary'),

    //! Получаем ссылку на <section class="section-hero"> ==> на poster_path:
    movieDetails: document.querySelector('.section-hero'),

    //! Получаем ссылки для модалки:
    // openModalBtn: document.querySelector('[data-action="open-modal"]'), //! ----- для тестирования
    closeModalBtn: document.querySelector('[data-action="close-modal"]'),
    backdrop: document.querySelector('.js-backdrop'),

    //! Получаем ссылку на строку предупреждения об отсутствии фильмов:
    resultNotSuccessful: document.querySelector('.search-alert'),

    //! Получаем ссылку на форму со строкой инпута:
    searchFormAlert: document.querySelector('.search'),

    //! Получаем ссылку на блок кнопок WATCHED и QUEUE в header:
    watchedQueueHeader: document.querySelector('.nav-library-buttons'),

    //! Получаем ссылку на кнопоку WATCHED в МОДАЛКЕ:
    watchedModal: document.querySelector('.modal-watched'),

    //! Получаем ссылку на кнопоку QUEUE в МОДАЛКЕ:
    queueModal: document.querySelector('.modal-queue'),

    //! Получаем ссылку на кнопоку WATCHED в header:
    watchedHeader: document.querySelector('.nav-library-watched'),

    //! Получаем ссылку на кнопоку QUEUE в header:
    queueHeader: document.querySelector('.nav-library-queue'),

  };
};

