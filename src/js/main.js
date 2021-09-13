'use strict';
//Nos traemos de html los elementos para trabajar con ellos en JS

const inputShow = document.querySelector('.js-searchinput');
const searchButton = document.querySelector('.js-search-btn');
const reset = document.querySelector('.reset__btn');
const resultsContainer = document.querySelector('.js-list-results'); //selecciono el elem. de html donde pintaré los resultados
const paintedFavs = document.querySelector('.js-favs');
let apiDataShows = []; //array donde almaceno resultados del api

let favorites = []; //array donde almaceno favoritos

//Función para hacer petición al servidor

function fetchToApi() {
  let inputShowValue = inputShow.value.toLocaleLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputShowValue}`)
    .then((response) => response.json())
    .then((data) => {
      apiDataShows = data; //guardo los datos del api en el array global
    });
  paintShows(); //incluyo la funcion painShows para que se me pinten los datos en cada petición
}

//Declaro la función para guardar en localStorage
function setInLocalStorage() {
  // stringify me permite transformar a string el array de favorites
  const stringShows = JSON.stringify(favorites);
  //añadimos  al localStorage  los datos convertidos en string previamente
  localStorage.setItem('favorites', stringShows);
}

function getLocalStorage() {
  // obtengo lo que hay en el LS
  const localStorageLoaded = localStorage.getItem('favorites');
  // cojo datos del local storage y compruebo si son válidos
  if (localStorageLoaded === null) {
    // no tengo datos en el local storage, así que llamo al API
    fetchToApi();
  } else {
    //tengo datos en el local storage,lo parseo a un array y
    const arrayFavorites = JSON.parse(localStorageLoaded);
    // lo guardo en la variable global de favorites
    favorites = arrayFavorites;

    paintFavs();
  }
}

//declaro la función manejadora del evento click que está asociado al botón search
function handleSearch(ev) {
  ev.preventDefault();
  fetchToApi();
}
//Añadimos evento que desencadena la funcion fetch al pulsar el boton, nos traemos los datos del api
searchButton.addEventListener('click', handleSearch);

// 1- -- Cuando carga la pagina
getLocalStorage();

//Esta función es la encargada de manejar el evento click (listenShows) sobre cada uno de los li de paintShows
function handleShows(ev) {
  const pickedShow = parseInt(ev.currentTarget.id); //los datos del id que recogemos de html son un string y los que recogemos del api number, así que los convierto a number con parseInt

  //a continuación aplico el metodo find al array apidatashows, de cada show le digo que me encuentre su id y comparo si es el mismo que el de html
  const objectClickedShow = apiDataShows.find((show) => {
    return show.show.id === pickedShow;
  });
  //del array de favoritos busco su posición en el array
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
  //console.log(favorites);
  paintShows();
  paintFavs();
  setInLocalStorage();
}

function listenShows() {
  const showList = document.querySelectorAll('.js-picked'); //selecciono los li que creé con la funcion paintShows, a continuación los recorro con un bucle y añado el tipo de evento y la función manejadora cuando el evento se desencadene.
  for (const show of showList) {
    show.addEventListener('click', handleShows);
  }
}

//Declaro una función para manejar el evento click sobre las X del listado de favoritos
//el funcionamiento es muy similar al de la función handleShows, usando el metodo findIndex para saber si en el array está el elemento que tenga el mismo id que el elemento que estamos escuchando cen el evento click.
function handleX(ev) {
  const showToClose = parseInt(ev.currentTarget.id);
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.show.id === showToClose;
  });
  if (favoritesFound === -1) {
    // y lo quito
    favorites.splice(favoritesFound, 1);
  }
  paintFavs();
  paintShows();
  setInLocalStorage();
}
//declaro esta funcion para añadir cuando se pinten los favoritos, manejada por la función handleX
function closeX() {
  const listX = document.querySelectorAll('.close-fav');
  for (let x of listX) {
    x.addEventListener('click', handleX);
    //console.log(listX);
  }
}

//código botón de reset, me vacías el array y el html de los elementos con clase .js-favs, limpias el localStorage con el método clear

function handleresetFavs() {
  favorites = [];
  paintedFavs.innerHTML = '';
  localStorage.clear();
}

reset.addEventListener('click', handleresetFavs); //añado el evento click al botón

//esta funcion la incluimos en la funcion fecth, cuando recibimos los datos solicitados los pintamos en el html
function paintShows() {
  let html = '';
  let favClass = '';
  for (const eachSerie of apiDataShows) {
    const oneSerie = eachSerie.show;
    const isFav = isFavorite(oneSerie); //guardo esta funcion (declarada en la linea 181) con oneSerie como parámetro dentro de la constante isfav. Si es true añado la clase, si no vacio, para usarla al pintar los li y darle un css diferente.
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

//funcion para añadir una clase para dar estilos diferentes a los favoritos que se encuentren el array favorites cuando utilizo paintShows

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
