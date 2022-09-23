import './css/styles.css';

import Notiflix from 'notiflix';
// import axios from 'axios';

//? Библиотека SimpleLightbox
import SimpleLightbox from "simplelightbox";
//? Библиотека SimpleLightbox - дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

import PixabayApiService from './js/api-pixabay-service.js'; //! Импорт класса PixabayApiService с ./js/get-refs.js
import getRefs from './js/get-refs.js'; //! Импорт всех ссылок с ./js/get-refs.js
import LoadMoreBtn from './js/load-more-btn.js'; //! Импорт класса LoadMoreBtn Кнопки LOAD MORE

// import API from './js/api-service.js';

const refs = getRefs(); //! Создаем объект всех ссылок refs.*

const pixabayApiService = new PixabayApiService(); //! Экземпляр класса PixabayApiService

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



// https://pixabay.com/api/?key=28759369-3882e1068ac26fe18d14affeb&q=yellow+flowers&image_type=photo //! Example URL
// fetch('https://pixabay.com/api/?key=28759369-3882e1068ac26fe18d14affeb&q=yellow+flowers&image_type=photo'); //! Example fetch-URL


//! Формируем строку URL-запроса:
// const url = `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&page=${page}&per_page=${per_page}`; //! with API_KEY
// console.log(url);


//todo  Создаем слушателя событий на поле ввода данных - input form:
refs.searchForm.addEventListener('submit', onFormSearch);

//todo  Создаем слушателя событий на кнопке LOAD MORE:
// refs.loadMoreBtn.addEventListener('click', onLoadMore); //! OLD => через import getRefs from './js/get-refs.js'
loadMoreBtn.refs.button.addEventListener('click', onLoadMore); //! NEW => через import LoadMoreBtn from './js/load-more-btn.js


//! +++++++++++++++++++++++++++++++++++ input form +++++++++++++++++++++++++++++++++++++++++++++++

//!  Ф-ция, к-рая прослушивает события на поле ввода данных - input form:
function onFormSearch(evt) {
    evt.preventDefault();
    console.log("Вешаю слушателя на поле ввода данных - input form"); //!



    //! это то, что приходит в input и 
    //! записывается с помощью сетера класса PixabayApiService в переменную searchQuery
    pixabayApiService.query = evt.currentTarget.elements.searchQuery.value.trim(); //! + убираем пробелы
    console.log("searchQuery: ", pixabayApiService.query); //!

    if (pixabayApiService.query === "") {
        return alert("Поле ввода не долно быть пустым!");
    }

    //! Кнопка LOAD MORE => показываем и отключаем
    loadMoreBtn.show()
    loadMoreBtn.disable()

    //! Делаем сброс значения page = 1 после submit form 
    //! с помощью метода resetPage из класса PixabayApiService
    pixabayApiService.resetPage()

    //! Очищаем контейнер при новом вводе данных в input form:
    clearHitsContainer()

    loadMoreBtn.disable()
    //? Делаем ОБЩИЙ fetch-запрос с помощью метода .fetchHits из класса PixabayApiService
    pixabayApiService.fetchHits()
        .then(({ totalHits, hits, endOfCollection }) => {
            // console.log("totalHits: ", totalHits); //!
            // console.log("hits: ", hits); //!
            // console.log("endOfCollection: ", endOfCollection); //!

            //! ПРОВЕРКА hits на пустой массив 
            checkHitsForEmpty(hits)

            showsTotalHits(totalHits) //* Консолим свойство totalHits
            return hits
        })
        // .then(appendHitsMarkup); // Рисование интерфейса выносим в отдельную ф-цию
        .then(hits => {
            appendHitsMarkup(hits); //* Рисование интерфейса выносим в отдельную ф-цию
            loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
            gallery.refresh();  //? Использование библиотеки SimpleLightbox:
            // gallery.on('show.simplelightbox', function () {
            // });
        });

    //! Использование библиотеки SimpleLightbox (НЕ ТУТ!!!)
    // gallery.refresh();
    // gallery.on('show.simplelightbox', function () {
    // });


    // У Ж Е   НЕ   Н А Д О  !!!!
    // Делаем fetch-запрос для получения totalHits
    // pixabayApiService.fetchTotalHits()
    //     .then(showsTotalHits); // Консолим свойство totalHits
}
//! ++++++++++++++++++++++++++++++++ Кнопка LOAD MORE ++++++++++++++++++++++++++++++++++++++++++++

//!  Ф-ция, к-рая прослушивает события на кнопке LOAD MORE:
function onLoadMore(evt) {
    loadMoreBtn.disable() //! Кнопка LOAD MORE => ВЫключаем


    //? Делаем fetch-запрос с помощью метода .fetchHits из класса PixabayApiService
    pixabayApiService.fetchHits()
        .then(({ totalHits, hits, endOfCollection }) => {
            // console.log("totalHits: ", totalHits); //!
            // console.log("hits: ", hits); //!

            //!  Проверка hits на ОКОНЧАНИЕ КОЛЛЕКЦИИИ
            checkHitsForEnd(endOfCollection)
            return hits
        })
        // .then(appendHitsMarkup); // Рисование интерфейса выносим в отдельную ф-цию
        .then(hits => {
            appendHitsMarkup(hits); //* Рисование интерфейса выносим в отдельную ф-цию
            loadMoreBtn.enable();  //! Кнопка LOAD MORE => включаем
            gallery.refresh();  //? Использование библиотеки SimpleLightbox:
        });

    //! Использование библиотеки SimpleLightbox (НЕ ТУТ!!!)
    // gallery.refresh();
    // gallery.on('show.simplelightbox', function () {
    // });

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





//todo  Ф-ция-then, к-рая отрисовывает интерфейс ВСЕХ карточек на странице:
function appendHitsMarkup(hits) {
    // // ! ПРОВЕРКА hits на пустой массив: (НЕ ЗДЕСЬ)
    // checkHitsForEmpty(hits)
    //!   Добавляем новую разметку в div-контейнер с помощью insertAdjacentHTML:
    refs.imageCards.insertAdjacentHTML('beforeend', createImageCardsMarkup(hits));
    // console.log(hits[0].largeImageURL); //! ссылка на большое изображение

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



//todo   Ф-ция, к-рая создает новую разметку для ОДНОЙ карточки:
function createImageCardsMarkup(hits) {
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












