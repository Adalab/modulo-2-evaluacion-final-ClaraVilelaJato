'use strict';
//Nos traemos de html los elementos para trabajar con ellos en JS

const inputShow = document.querySelector('.js-searchinput');
const searchButton = document.querySelector('.js-search-btn');
const reset = document.querySelector('.reset__btn');
const resultsContainer = document.querySelector('.js-list-results'); //selecciono el elem. de html donde pintaré los resultados

let apiDataShows = []; //array donde almaceno resultados

let favorites = [];

//Función para hacer petición al servidor

function fetchToApi() {
  let inputShowValue = inputShow.value.toLocaleLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputShowValue}`)
    .then((response) => response.json())
    .then((data) => {
      apiDataShows = data;
    });
  paintShows();
  console.log(apiDataShows);
}

function handleSearch(ev) {
  ev.preventDefault();
  fetchToApi();
}
//Añadimos evento que desencadena la funcion fetch al pulsar el boton, nos traemos los datos del api
searchButton.addEventListener('click', handleSearch);

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
}

function listenShows() {
  const showList = document.querySelectorAll('.js-picked'); //le doy clase a los li que cree con la funcion paint
  for (const show of showList) {
    show.addEventListener('click', handleShows);
  }
}

//esta funcion la incluimos en la funcion fecth
function paintShows() {
  let html = '';
  for (const eachSerie of apiDataShows) {
    const oneSerie = eachSerie.show;
    let image = '';
    if (oneSerie.image === null) {
      image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else {
      image = oneSerie.image.medium;
    }
    html += `<li id="${oneSerie.id}" class="serie__box js-picked">`;
    html += `<div class="border-show">`;
    html += `<img src="${image}" alt="${oneSerie.name}">`;
    html += `<h3 class="serie__name">${oneSerie.name}</h3></li>`;
    html += `</div>`;
  }
  resultsContainer.innerHTML = html;
  listenShows();
}

//# sourceMappingURL=main.js.map
