'use strict';
//Nos traemos de html los elementos para trabajar con ellos en JS

const inputShow = document.querySelector('.js-searchinput');
const searchButton = document.querySelector('.js-search-btn');
const reset = document.querySelector('.reset__btn');
const resultsContainer = document.querySelector('.js-list-results'); //selecciono el elem. de html donde pintaré los resultados
const paintedFavs = document.querySelector('.js-favs');
let apiDataShows = []; //array donde almaceno resultados

let favorites = [];

function setInLocalStorage() {
  // stringify me permite transformar a string el array de favorites
  const stringShows = JSON.stringify(favorites);
  //añadimos  al localStorage  los datos convertidos en string previamente
  localStorage.setItem('favorites', stringShows);
}

//Función para hacer petición al servidor

function fetchToApi() {
  let inputShowValue = inputShow.value.toLocaleLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputShowValue}`)
    .then((response) => response.json())
    .then((data) => {
      apiDataShows = data;
    });
  paintShows();
}

function getLocalStorage() {
  // obtenermos lo que hay en el LS
  const localStorageLoaded = localStorage.getItem('favorites');
  // siempre que cojo datos del local storage tengo que comprobar si son válidos
  // es decir si es la primera vez que entro en la página
  if (localStorageLoaded === null) {
    // no tengo datos en el local storage, así que llamo al API
    fetchToApi();
  } else {
    // sí tengo datos en el local storage,lo parseo a un array y
    const arrayFavorites = JSON.parse(localStorageLoaded);
    // lo guardo en la variable global de favorites
    favorites = arrayFavorites;

    paintFavs();
  }
}

function handleSearch(ev) {
  ev.preventDefault();
  fetchToApi();
}

//Añadimos evento que desencadena la funcion fetch al pulsar el boton, nos traemos los datos del api
searchButton.addEventListener('click', handleSearch);

// 1- -- Cuando carga la pagina
getLocalStorage();

//Esta función es la encargada de manejar el evento click sobre cada uno de los li
function handleShows(ev) {
  const pickedShow = parseInt(ev.currentTarget.id);
  const objectClickedShow = apiDataShows.find((show) => {
    return show.show.id === pickedShow;
  });
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.show.id === pickedShow;
  });

  if (favoritesFound === -1) {
    // añado al array de favoritos
    favorites.push(objectClickedShow);
  } else {
    // si el findIndex me ha devuelto un número mayor o igual a 0 es que sí está en el array de favoritos
    // quiero sacarlo de array de favoritos
    // para utilizar splice necesito el índice del elemento que quiero borrar
    // y quiero borrar un solo elemento por eso colocamos 1
    favorites.splice(favoritesFound, 1);
  }
  console.log(favorites);
  paintShows();
  paintFavs();
  setInLocalStorage();
}

function handleX(ev) {
  const showToClose = parseInt(ev.currentTarget.id);
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.show.id === showToClose;
  });
  if (favoritesFound === -1) {
    favorites.splice(favoritesFound, 1);
  }
  paintFavs();
  paintShows();
  setInLocalStorage();
}

function closeX() {
  const listX = document.querySelectorAll('.close-fav');
  for (let x of listX) {
    x.addEventListener('click', handleX);
    console.log(listX);
  }
}

function listenShows() {
  const showList = document.querySelectorAll('.js-picked'); //le doy clase a los li que cree con la funcion paint
  for (const show of showList) {
    show.addEventListener('click', handleShows);
  }
}

//codigo botón de reset

function handleresetFavs() {
  favorites = [];
  paintedFavs.innerHTML = '';
  localStorage.clear();
}

reset.addEventListener('click', handleresetFavs);

//esta funcion la incluimos en la funcion fecth
function paintShows() {
  let html = '';
  let favClass = '';
  for (const eachSerie of apiDataShows) {
    const oneSerie = eachSerie.show;
    const isFav = isFavorite(oneSerie);
    if (isFav) {
      favClass = 'js-selected-list';
    } else {
      favClass = '';
    }
    let image = '';
    if (oneSerie.image === null) {
      image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else {
      image = oneSerie.image.medium;
    }
    html += `<li id="${oneSerie.id}" class="serie__box js-picked ${favClass}">`;
    html += `<div class="border-show">`;
    html += `<img class="list-image" src="${image}" alt="${oneSerie.name}">`;
    html += `<h3 class="serie__name">${oneSerie.name}</h3></li>`;
    html += `</div>`;
  }
  resultsContainer.innerHTML = html;
  listenShows();
}

function paintFavs() {
  let html = '';
  paintedFavs.innerHTML = '';
  for (let favorite of favorites) {
    const favoriteShow = favorite.show;
    let image = '';
    if (favoriteShow.image === null) {
      image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else {
      image = favoriteShow.image.medium;
    }
    html += `<button value="x" class="close-fav">x</button><li id="${favoriteShow.id}" class="fav__card">`;
    html += `<img class="fav__image" src="${image}" alt="${favoriteShow.name}">`;
    html += `<h3 class="fav__name">${favoriteShow.name}</h3></li>`;
  }

  paintedFavs.innerHTML = html;
  closeX();
}

//funcion para añadir una clase a los favoritos que se encuentren el array cuando utilizo paintShows

function isFavorite(oneSerie) {
  const favoriteFound = favorites.find((fav) => {
    return fav.show.id === oneSerie.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//# sourceMappingURL=main.js.map
