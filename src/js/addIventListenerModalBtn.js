// import { onWatchedModal } from '../index.js';
// import { onQueueModal } from '../index.js';

//! Импорт всех ссылок с ../js/get-refs.js
// import getRefs from '../js/get-refs.js';



// function getRefs() {
//     return {
//         //! Получаем ссылку на кнопоку ADD TO WATCHED в МОДАЛКЕ:
//         // watchedModal: document.querySelector('.modal-watched'), //todo OLD
//         watchedModal: document.querySelector('button[data-action="modal-add-watched"]'), //todo ПОКА НЕ НАДО уже есть из импорта


//         //! Получаем ссылку на кнопоку ADD TO QUEUE в МОДАЛКЕ:
//         // queueModal: document.querySelector('.modal-queue'), //todo OLD
//         queueModal: document.querySelector('button[data-action="modal-add-queue"]'), //todo ПОКА НЕ НАДО уже есть из импорта
//     };
// };


export default function addIventListenerModalBtn() {

    //todo +++++++++ Создаем слушателей на кнопках <ADD TO WATCHED> и <ADD TO QUEUE> для МОДАЛКИ ++++++++++++++
    const refs = {
        //! Получаем ссылку на кнопоку ADD TO WATCHED в МОДАЛКЕ:
        watchedModal: document.querySelector('button[data-action="modal-add-watched"]'), //todo ПОКА НЕ НАДО уже есть из импорта
        //! Получаем ссылку на кнопоку ADD TO QUEUE в МОДАЛКЕ:
        queueModal: document.querySelector('button[data-action="modal-add-queue"]'), //todo ПОКА НЕ НАДО уже есть из импорта
    };

    console.log("refs:", refs); //!

    refs.watchedModal.addEventListener('click', () => {
        console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO WATCHED в МОДАЛКЕ"); //!
    });

    refs.queueModal.addEventListener('click', () => {
        console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO QUEUE в МОДАЛКЕ"); //!
    });

    //!----------------------------------------------------------------------------------
    // const watchedModal = document.querySelector('[data-action="modal-add-watched"]');
    // console.log("btnModalWatched:", watchedModal);

    // watchedModal.addEventListener('click', () => {
    //     console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO WATCHED в МОДАЛКЕ"); //!
    // });


    // const queueModal = document.querySelector('[data-action="modal-add-queue"]');
    // console.log("queueModal:", queueModal);

    // queueModal.addEventListener('click', () => {
    //     console.log("Вешаю ГОТОВОГО слушателя на кнопку ADD TO QUEUE в МОДАЛКЕ"); //!
    // });
}



// export default function addIventListenerModalBtn() {
//     const btnWatched = document.querySelector('[data-action="modal-add-watched"]');
//     console.log("btnModalWatched:", btnWatched);

//     const btnModalQueue = document.querySelector('[data-action="modal-add-queue"]');
//     console.log("btnModalQueue:", btnModalQueue);

//     btnModalQueue.addEventListener('click', () => {
//         onQueueModal();
//     });
//     btnWatched.addEventListener('click', () => {
//         onWatchedModal();
//     });
// }


