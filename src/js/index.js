import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as SearchView from './views/SearchView';
import * as LikeView from './views/LikeView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/ListView';
import { elements, renderLoad } from './views/base';



/* -- global state --- */
const state = {};


// lIST CONTROLLER

const controlList = () => {
    if (!state.list) {
        state.list = new List;
        state.recipe.ingredients.forEach(el => {
            const item = state.list.addItem(el.count, el.unit, el.ingredient);
            ListView.renderItem(item);
        })
    }
}

// SEARCH CONTROLLER

const controlSearch = async () => {
    //1. get query from value
    const query = SearchView.getInput();

    if(query){
        //2. new object + add to state
        state.search = new Search(query);
        //3. prepare UI for results
        renderLoad(elements.resultList);
        //4. search for recipes
        await state.search.getResults();
        //5. render results
        SearchView.renderResults(state.search.result);
        //console.log(state.search.result);
    }

    elements.searchInput.value = '';
}

// ['keyup','submit'].forEach(event => addEventListener(event, e=> {
//     e.preventDefault();
//     SearchView.clearResults();
//     controlSearch();
// }))

elements.submitForm.addEventListener('submit', e => {
    e.preventDefault();
    SearchView.clearResults();
    controlSearch();
})

elements.buttons.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto);
        SearchView.renderResults(state.search.result, goToPage, 10);
    }
})


// RECIPE CONTROLLER

const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    if (id){
        //1.Prepare UI
        renderLoad(elements.recipeData);
        //2.Create recipe object
        state.recipe = new Recipe(id);
        try {
        //3.Get Recipe data
        await state.recipe.getRecipe();
        //4. Calculate times
        state.recipe.calcServings();
        state.recipe.calcTime();
        state.recipe.parseIngredients();
        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
        //5. Render Result
        RecipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        if (state.search) {SearchView.highlightLink(state.recipe.id)};
    }
}


['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

// LIKE CONTROLLER
const controlLike = () => {
    if (!state.likes) state.likes = new Like();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        //Isnt liked yet

        //add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle heart button
        LikeView.toggleLikeBtn(true);
        // add like to ui
        LikeView.renderLikes(newLike);
    } else {
        // is liked yet
        state.likes.deleteLike(currentID);
        LikeView.toggleLikeBtn(false);
        LikeView.deleteLikes(currentID);
    }

    LikeView.toggleMainLikeButton(state.likes.getNumLikes());
 }

 //Restore likes on page load
 window.addEventListener('load', () => {

    state.likes = new Like();
    state.likes.readStorage();
    LikeView.toggleMainLikeButton(state.likes.getNumLikes());
    state.likes.likes.forEach(like => LikeView.renderLikes(like));
 })


// Handling delete and update list shoppings buttons
elements.shoppingList.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id)
        ListView.deleteItem(id);
//Handle the count buttons
    } else if (e.target.matches('.shopping__count--value')){
        const value = parseFloat(e.target.value);
        state.list.updateCount(id, value);
    }
})


// Handling servings buttons

elements.recipeData.addEventListener('click', e => {

    const id = window.location.hash.replace('#','');

    if (e.target.closest('.btn-tiny')) {
        const type = e.target.closest('.btn-tiny').dataset.serv;
        if (!(state.recipe.servings === 1 && type === 'dec')) {
            state.recipe.updateServings(type);
            RecipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
    } else if (e.target.closest('.recipe__btn--add, .recipe__btn-add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
})