

(function checkStorage () {
    if(localStorage.favorites === undefined){
        localStorage.setItem("favorites", JSON.stringify([]));
    }
})();

const favorites = {
    
    store: [],

    getStore: function() {
        const mooogleStore = JSON.parse(localStorage.Mooogle);

        console.log(mooogleStore);

        this.store = mooogleStore.favorites === undefined ? [] : mooogleStore.favorites;
        return this;
    },

    saveStore: function() {

        console.log('this store', this.store);

        
        const mooogleStore = {
            favorites: JSON.parse(localStorage.favorites)
        }
        

        console.log(this.store);

        

        mooogleStore.favorites[this.store[0].id] = this.store[0]
        console.log(mooogleStore.favorites);
        this.store = [];
        localStorage.setItem("favorites", JSON.stringify(mooogleStore.favorites));
    },

    successGetInfo: function(result) {
        let data = JSON.parse(result);

        console.log(data);
        
        if(Object.getOwnPropertyNames(data).includes('first_air_date'))
            data.release_date = data.first_air_date;
        if(Object.getOwnPropertyNames(data).includes('name'))
            data.title = data.name;

        let dataToSave = {
            title: data.title,
            release_date: data.release_date,
            id: data.id,
            genres: data.genres
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
            theMovieDb.movies.getById({"id":id, "language": "ru-RUS",}, this.successGetInfo, this.errorGetInfo);
        } else {
//tvshow
            theMovieDb.tv.getById({"id":id, "language": "ru-RUS",}, this.successGetInfo, this.errorGetInfo);
        }
    },

    getAll: function() {

    }
};

favorites.getStore();

window.addEventListener('click', (event)=>{
    if(event.target.classList.contains('movie-card__button--favorite'))
    {
        console.log('movieCard', event.target);
        const movieId = event.target.dataset.id;

        favorites.add(movieId);

    }
});