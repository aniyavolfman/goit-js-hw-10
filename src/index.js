import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const divCountryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');
const inputEl = document.querySelector('input[id="search-box"]');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    if (inputEl.value.trim() === '') {
        divCountryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
        return;
    }
    fetchCountries(inputEl.value.trim())
        .then(countries => {
            if (countries.length === 1) {
                renderCountryInfo(countries);
                countryListEl.innerHTML = '';
            }
            else if (countries.length > 10) {
                Notify.info("Too many matches found. Please enter a more specific name.");
                countryListEl.innerHTML = '';
                divCountryInfoEl.innerHTML = '';
            }
            else if (countries.length >= 2 && countries.length <= 10) {
                renderCountriesList(countries);
                divCountryInfoEl.innerHTML = '';
                
            };
        })
    .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        divCountryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
    });
}

function renderCountryInfo(countries) {
    const markup = countries.map((country) => {
        return `
        <div>
        <img src='${country.flags.svg}' alt='flag' width="22" height="22">
        <h1 class='flag-header'>${country.name.official}</h1>
        <p><span class='text'>Capital: </span> ${country.capital}</p>
        <p><span class='text'>Population: </span>${country.population}</p>
        <p><span class='text'>Languages: </span>${Object.values(country.languages)}</p>
        </div>`;
    }).join('');
    divCountryInfoEl.innerHTML = markup;
}

function renderCountriesList(countries) {
    const markup = countries.map((country) => {
        return `
        <li>
        <img src='${country.flags.svg}' alt='flag' width="20" height="20">
        <p class='flag-text'>${country.name.official}</p>
        </li>`;
    }).join('');
    countryListEl.innerHTML = markup;
}