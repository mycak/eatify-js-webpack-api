import axios from 'axios';

export default class Recipe {
    constructor(id){
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error){
            console.log(error)
        }
    }

    calcTime(){
        const allIngredients = this.ingredients.length;
        const period = Math.ceil(allIngredients/4);
        this.time = period * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            //1 uniform units
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })
            //2 remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, "");
            //3 parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objInit;
            if (unitIndex > -1){
                // There is a unit
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if (arrCount,length === 1){
                    count = eval(arrCount[0].replace('-','+'))
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objInit = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if (parseInt(arrIng[0],10)){
                // there is no unit but is number
                objInit = {
                 count: parseInt(arrIng[0],10),
                 unit: '',
                 ingredient: arrIng.slice(1).join(' ')
                 }
             }
            else if (unitIndex === -1){
                 //there isnt a unit
                 objInit = {
                     count: 1,
                     unit: '',
                     ingredient
                 }
            } 

            return objInit;
        })
        this.ingredients = newIngredients;
    }

    updateServings(type){
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        this.ingredients.forEach(ing =>{
            ing.count = ing.count*(newServings/this.servings);
        })
        this.servings = newServings;
    }
}