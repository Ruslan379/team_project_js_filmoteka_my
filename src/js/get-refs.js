export default function getRefs() {
  return {
    //todo Получаем ссылку на input form:
    searchForm: document.querySelector('#search-form'),

    //todo Получаем ссылку на div-контейнер для разметки карточек изображений:
    imageCards: document.querySelector('.gallery'),

    //todo Получаем ссылку на кнопку HOME:
    homeBtn: document.querySelector('.button-home'),

    //todo Получаем ссылку на кнопку Filmoteka:
    filmotekaBtn: document.querySelector('.button-filmoteka'),
  };
}

