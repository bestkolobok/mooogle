

(function checkStorage () {
    if(!localStorage.favorites){
        localStorage.setItem("favorites", JSON.stringify({}));
    }
})();

const favorites = {
    
    store: [],

    saveStore: function() {
      
        const mooogleStore = {
            favorites: JSON.parse(localStorage.favorites)
        }

        mooogleStore.favorites[this.store[0].id] = this.store[0]

        this.store = [];

        localStorage.setItem("favorites", JSON.stringify(mooogleStore.favorites));

    },

    successGetInfo: function(result) {

        let data = JSON.parse(result);

        console.log(data);
        

        if(Object.getOwnPropertyNames(data).includes('name'))
            data.title = data.name;

        let dataToSave = {
            title: data.title,
            release_date: data.release_date,
            id: data.id,
            genres: data.genres,
            poster_path: data.poster_path
            
        }

        if(Object.getOwnPropertyNames(data).includes('first_air_date')){
            dataToSave.release_date = data.first_air_date;
            dataToSave.first_air_date = data.first_air_date;
        }

        favorites.store.push(dataToSave);

        favorites.saveStore();
        
    },

    errorGetInfo: function(result) {
        console.log(result);
    },

    add: function(id) {
        
        if(id.length > 5){
//movie     
            theMovieDb.movies.getById({"id":id, "language": "ru-RUS",}, favorites.successGetInfo, favorites.errorGetInfo);
        } else {
//tvshow
            theMovieDb.tv.getById({"id":id, "language": "ru-RUS",}, favorites.successGetInfo, favorites.errorGetInfo);
        }
    },

    getAll: function() {
        var favoritesFromLocalStore = localStorage.getItem('favorites');
        var parsedFavorits = JSON.parse(favoritesFromLocalStore)
        var arr = [];

        for (const key in parsedFavorits) {
            arr.push(parsedFavorits[key]);
        }
       
        return arr;
    }
};

var addToFavorite = (event)=>{
    if(event.target.classList.contains('movie-card__button--favorite'))
    {
        const movieId = event.target.dataset.id;
        favorites.add(movieId);
    }
}

window.addEventListener('click', addToFavorite);