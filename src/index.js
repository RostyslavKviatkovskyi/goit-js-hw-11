import Notiflix from 'notiflix';
// import { fetchImages } from './fetchImages';
import axios from 'axios';
import { markup } from './gallery-markup';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  submitBtn: document.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const BASE_URL = 'https://pixabay.com/api';
const KEY = '30215084-a49b4b97181de8b711ff6b4da';

const params = {
  page: 1,
  perPage: 40,
  q: '',
};

refs.loadMoreBtn.classList.add('is-hidden');

function onFormSubmit(event) {
  event.preventDefault();
  params.page = 1;
  params.q = refs.inputEl.value;
  refs.galleryEl.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  fetchImages();
}

async function fetchImages() {
  const parameters = new URLSearchParams({
    ...params,
    image_type: 'photo',
    orientation: 'horizontal',
    pretty: true,
    key: KEY,
  });

  try {
    const response = await axios.get(`${BASE_URL}/?${parameters}`);
    const loadHits = response.data.hits.length;
    const totalHits = response.data.totalHits;

    if (loadHits === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (params.page === 1) {
      Notiflix.Notify.success(`We have found ${totalHits} images.`);
    }

    galleryMarkup(response.data.hits);
    refs.loadMoreBtn.classList.remove('is-hidden');

    // refs.outputPagesLoad.textContent = `${
    //   (params.page - 1) * params.per_page + loadHits
    // } of ${totalHits}`;

    if (params.page * params.per_page >= totalHits) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function onLoadMore() {
  params.page += 1;
  fetchImages();
}

function galleryMarkup(photos) {
  refs.galleryEl.insertAdjacentHTML('beforeend', markup(photos));
}
