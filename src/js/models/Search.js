import axios from 'axios';
//https://forkify-api.herokuapp.com/api/search


export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults(){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes;
        }
        catch (err){
            console.log('Not existing');
            console.log(err);
        }
    }
}

