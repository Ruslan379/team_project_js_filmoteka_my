import Notiflix from 'notiflix';


// ! +++++++++++++++++++++++ БЛОК ЛОГИКИ работы кнопок <ADD TO WATCHED> и <ADD TO QUEUE> +++++++++++++++++++++++
export default function operationLogicWatchedQueue(currentPage, refs, infoFilm, localStorageWatched, localStorageQueue) {
    console.log("БЛОК ЛОГИКИ_currentPage ==>:", currentPage); //!
    console.log("БЛОК ЛОГИКИ_refs.watchedModal ==>:", refs.watchedModal); //!
    console.log("БЛОК ЛОГИКИ_refs.queueModal ==>:", refs.queueModal); //!

    //? ------------------------------------------- кнопки WATCHED и QUEUE -------------------------------------------
    //! Устанвливаем начальные значения textContent для кнопки WATCHED в модалке
    refs.watchedModal.textContent = "ADD TO WATCHED";
    if (refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.remove("colorRed");
    if (!refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.add("colorGreen");

    //! Устанвливаем начальные значения textContent для кнопки QUEUE в модалке
    refs.queueModal.textContent = "ADD TO QUEUE";
    if (refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.remove("colorRed");
    if (!refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.add("colorGreen");

    //! ИЛИ: в зависимости от того, на какой странице находится пользователь:

    //! 1.Логика работы кнопок на странице <HOME или Filmoteka> и <Movie search> если фильм уже есть в localStorage
    if (currentPage === "home-Filmoteka" || currentPage === "Movie search") {
        // console.log("currentPage = home-Filmoteka && Movie search"); //!
        //! Замена "ADD TO WATCHED" на "DELETE FROM WATCHED" если фильм уже есть в localStorage
        if (localStorageWatched.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в WATCHED`, {
                position: 'left-top',
                showOnlyTheLastOne: false,
                clickToClose: true,
                timeout: 3000,
            });
            refs.watchedModal.textContent = "DELETE FROM WATCHED";
            if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
            if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");
        };
        //! Замена "ADD TO QUEUE" на "DELETE FROM QUEUE" если фильм уже есть в localStorage
        if (localStorageQueue.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в QUEUE`, {
                position: 'left-top',
                showOnlyTheLastOne: false,
                clickToClose: true,
                timeout: 3000,
            });
            refs.queueModal.textContent = "DELETE FROM QUEUE";
            if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
            if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
        };
    };
    //? ------------------------------------------- кнопка WATCHED -------------------------------------------
    //! 2.Замена "ADD TO WATCHED" на "DELETE FROM WATCHED" если пользователь на странице MY LIBRARY==>WATCHED
    if (currentPage === "watched") {
        refs.watchedModal.textContent = "DELETE FROM WATCHED";
        if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
        if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");
        //! Замена "ADD TO QUEUE" на "DELETE FROM QUEUE" если пользователь на странице MY LIBRARY==>WATCHED и фильм уже есть в localStorage-QUEUE
        if (localStorageQueue.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в QUEUE`, {
                position: 'left-top',
                showOnlyTheLastOne: false,
                clickToClose: true,
                timeout: 3000,
            });
            refs.queueModal.textContent = "DELETE FROM QUEUE";
            if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
            if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
        };
    };

    //? ------------------------------------------- кнопка QUEUE -------------------------------------------
    //! 3.Замена "ADD TO QUEUE" на "DELETE FROM QUEUE" если пользователь на странице MY LIBRARY==>QUEUE
    // refs.queueModal.classList.add("colorGreen");
    if (currentPage === "queue") {
        refs.queueModal.textContent = "DELETE FROM QUEUE";
        if (refs.queueModal.classList.contains("colorGreen")) refs.queueModal.classList.remove("colorGreen");
        if (!refs.queueModal.classList.contains("colorRed")) refs.queueModal.classList.add("colorRed");
        //! Замена "ADD TO WATCHED" на "DELETE FROM WATCHED" если пользователь на странице MY LIBRARY==>QUEUE и фильм уже есть в localStorage-WATCHED
        if (localStorageWatched.find(option => option.id === infoFilm.id)) {
            Notiflix.Notify.warning(`Фильм ${infoFilm.title || infoFilm.name} уже есть в WATCHED`, {
                position: 'left-top',
                showOnlyTheLastOne: false,
                clickToClose: true,
                timeout: 3000,
            });
            refs.watchedModal.textContent = "DELETE FROM WATCHED";
            if (refs.watchedModal.classList.contains("colorGreen")) refs.watchedModal.classList.remove("colorGreen");
            if (!refs.watchedModal.classList.contains("colorRed")) refs.watchedModal.classList.add("colorRed");
        };
    };
};

