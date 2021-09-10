'use strict';
//Nos traemos de html los elementos para trabajar con ellos en JS

const inputShow = document.querySelector('.js-searchinput');
const searchButton = document.querySelector('.js-search-btn');
const reset = document.querySelector('.reset__btn');
const resultsContainer = document.querySelector('.js-list-results'); //selecciono el elem. de html donde pintaré los resultados

let apiDataShows = []; //array donde almaceno resultados

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

function handleSearch(ev) {
  ev.preventDefault();
  fetchToApi();
}
//Añadimos evento que desencadena la funcion fetch al pulsar el boton, nos traemos los datos del api
searchButton.addEventListener('click', handleSearch);

function paintShows() {
  let html = '';
  for (const eachSerie of apiDataShows) {
    const oneSerie = eachSerie.show;
    console.log(oneSerie.id);
    let image = '';
    if (oneSerie.image === null) {
      image = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    } else {
      image = oneSerie.image.medium;
    }
    html += `<li id="${oneSerie.id}" class="serie__list--item js-favorite"><img src="${image}" alt="${oneSerie.name}"><h3 class="item__name">${oneSerie.name}</h3></li>`;
  }
  resultsContainer.innerHTML = html;
}
