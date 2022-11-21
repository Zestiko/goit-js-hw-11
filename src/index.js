import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.5.min.css";


//Constants 
const API_KEY = "31396399-0c0a53b00e87586b8fc1cddd2";
const BASE_URL = "https://pixabay.com/api/"
//Variables
let pageCounter = 1;
let inputValue = '';

//Refs
const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more')
};
console.log(refs.gallery)
//Listeners
refs.form.addEventListener('submit', onFormSearch);
refs.loadMoreButton.addEventListener('click', onLoadMoreClick)

//Functions
function onFormSearch(e) {
  e.preventDefault();
  pageCounter = 1;
  const formData  = new FormData(e.currentTarget);
  console.log(formData);
  for (const value of formData.values()) {
    inputValue = value.trim().replace(/ /ig, '+');    
  };
  console.log(inputValue);
  axiosImages(inputValue,pageCounter); 
}
function onLoadMoreClick(e) {
  e.preventDefault();
  pageCounter += 1;
  axiosImages(inputValue,pageCounter); 
}
async function axiosImages(name, pageCounter) {
  try { 
    const images = axios(`${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo0&orientation=horizontal&safesearch=true&per_page=30&page=${pageCounter}`)
      .then(careateMarkup);
  } catch (error) {
    console.error(error);
  }  
};

function careateMarkup (response) {
    console.log(response);
    if (response.data.hits.length === 0) {
      Notify.failure('Qui timide rogat docet negare');
    } else {
      const markup = response.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
      `  <div class="photo-card  border-solid border-2 border-indigo-600 shadow-md rounded-lg p-5 bg-purple-300 mb-5">
          <a  href="${largeImageURL}"><img class="rounded-lg mb-3" src="${webformatURL}" alt="cat1" title="${tags}" loading="lazy" width="320" height="213" /></a>
          <div class="info flex justify-around w-80">
            <p class="info-item flex flex-col items-center">
              <b>Likes</b>
              <b>${likes}</b>
            </p>
            <p class="info-item flex flex-col items-center">
              <b>Views</b>
              <b>${views}</b>
            </p>
            <p class="info-item flex flex-col items-center">
              <b>Comments</b>
              <b>${comments}</b>
            </p>
            <p class="info-item flex flex-col items-center">
              <b>Downloads</b>
              <b>${downloads}</b>
            </p>
          </div>
        </div>`).join('');
      addImagesOnPage(markup);
      addLoadMoreButton();
    }
        
  // return markup;
};

function addImagesOnPage(markup) {
  refs.gallery.innerHTML += markup
  console.log(markup)
};

function addLoadMoreButton() {
  refs.loadMoreButton.classList.remove("hidden")
}

//init Gallery
let galleryNew = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });