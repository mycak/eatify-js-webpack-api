export const elements = {
    submitForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    resultList: document.querySelector('.results__list'),
    buttons: document.querySelector('.results__pages'),
    recipeData: document.querySelector('.recipe'),
    shoppingList:document.querySelector('.shopping__list'),
    buttonLove: document.querySelector('.recipe__love'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}


export const renderLoad = parent => {
    const loader = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `
    parent.innerHTML = loader;
}