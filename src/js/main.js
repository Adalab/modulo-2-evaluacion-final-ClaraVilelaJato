'use strict';
//Nos traemos de html los elementos para trabajar con ellos en JS

const inputShow = document.querySelector('.js-searchinput');
const searchButton = document.querySelector('.js-search-btn');
const reset = document.querySelector('.reset__btn');

let apiData = [];

//Función para hacer petición al servidor

function fetchToApi() {
  let inputShowValue = inputShow.value.toLocaleLowerCase();
  fetch(`https://api.tvmaze.com/search/shows?q=${inputShowValue}`)
    .then((response) => response.json())
    .then((data) => {
      apiData = data;
    });
  console.log(apiData);
}

function handleSearch(ev) {
  ev.preventDefault();
  fetchToApi();
}
//Añadimos evento que desencadena la funcion fetch al pulsar el boton, nos traemos los datos del api
searchButton.addEventListener('click', handleSearch);
