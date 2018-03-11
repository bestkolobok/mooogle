

(function checkStorage () {
    if(localStorage.Mooogle === undefined){
        localStorage.Mooogle = JSON.stringify([]);
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
        const mooogleStore = JSON.parse(localStorage.Mooogle);
        mooogleStore.favorites = this.store;
        localStorage.Mooogle = JSON.stringify(mooogleStore);
    },

    add: function(id) {
        
        this.store = [...this.store, ...[id]];
        console.log(this)
        this.saveStore();
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