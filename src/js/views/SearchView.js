import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const highlightLink = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

const shortTitle = title => {
    if (title.length>14){
        return title.substring(0, 14) + '...';
    } else {
        return title;
    }
}

const renderRecipe = recipe => {
    elements.resultList.innerHTML = elements.resultList.innerHTML + `
    <li>
    <a class="results__link results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${shortTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
    </li>
    `
}

export const clearResults = () => {
    elements.resultList.innerHTML = ' ';
}

const createButtons = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
    </button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    if (page === 1 && pages > 1) {
        elements.buttons.innerHTML = createButtons(page, 'next')
    } else if (page === pages && pages > 1) {
        elements.buttons.innerHTML = createButtons(page, 'prev');
    } else if (page > 1 && page < pages) {
        elements.buttons.innerHTML = createButtons(page, 'prev') + createButtons(page, 'next');
    }
}

export const renderResults = (recipes, page = 1, resPerPag = 10) => {
    elements.resultList.innerHTML = ' ';
    const start = (page -1) * resPerPag;
    const end = page * resPerPag;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPag);
}