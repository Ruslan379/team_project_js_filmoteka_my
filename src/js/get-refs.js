export default function getRefs() {
  return {
    //! Получаем ссылку на input form:
    searchForm: document.querySelector('#search-form'),

    //! Получаем ссылку на div-контейнер для разметки карточек изображений:
    imageCards: document.querySelector('.gallery'),

    //! Получаем ссылку на кнопку HOME:
    homeBtn: document.querySelector('.button-home'),

    //! Получаем ссылку на кнопку Filmoteka:
    filmotekaBtn: document.querySelector('.button-filmoteka'),

    //! Получаем ссылку на <section class="section-hero"> ==> на poster_path:
    movieDetails: document.querySelector('.section-hero'),

    //! Получаем ссылки для модалки:
    // openModalBtn: document.querySelector('[data-action="open-modal"]'), //! ----- для тестирования
    closeModalBtn: document.querySelector('[data-action="close-modal"]'),
    backdrop: document.querySelector('.js-backdrop'),

    //! Получаем ссылку на строку предупреждения об отсутствии фильмов:
    resultNotSuccessful: document.querySelector('.search-form-alert'),
  };
};

