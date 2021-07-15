class Taste extends HTMLElement {

    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'
    lastFavoritesReceived

    static get observedAttributes() {
        return ['imagename', 'viewname', 'mode'];
    }

    constructor() {
        super();
        console.log('Initializing Taste Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/taste.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showTaste();

        var buttonnames = ['vegan', 'seafood', 'noodles', 'cafe'];

        var component = this;

        buttonnames.forEach(function (buttonname) {
            let b = component.shadowRoot.getElementById(buttonname);
            b.onclick = component.showRestaurantOptions.bind(component);
        })

        let outcome = await getKitchenList()
        let popular = null
        try {
            popular = await getFavoriteRestaurants()
            this.lastFavoritesReceived = popular
        } catch (error) {
            popular = 'noop'
        }
        let rlist
        try {
            // if read from json
            let rlistText = await outcome.text();
            rlist = JSON.parse(rlistText)
        } catch (error) {
            rlist = outcome
        }
        this.restaurants = rlist;
        if (popular == "noop") {
            this.randomRestaurantList(this.restaurants);
        } else {
            this.showPopularRestaurantsList(this.restaurants, popular, false)
        }
        
        // connect to socket
        this.socketConnection()
    }

    socketConnection() {
        socketFavoriteRestaurants(dataObject => {
            console.log(dataObject)
            if (!_.isEqual(dataObject,this.lastFavoritesReceived)) {
                // update view
                this.lastFavoritesReceived = dataObject
                this.showPopularRestaurantsList(this.restaurants, dataObject, true)
            }
        })
    }

    showPopularRestaurantsList(restaurants, popular, notify) {
        if(Object.keys(popular.favorites).length == 0) {
            console.log("showing randomized")
            this.randomRestaurantList(this.restaurants)
        } else {
            let popularIds = Object.keys(popular.favorites)
            let popularIdsTemp = Object.keys(popular.favorites)
            // console.log(popular.favorites[popularIds[0]])
            console.log("showing popular")
            let arrayOfRestaurants = restaurants.filter(obj => {
                let foundMatch = false
                for (let i in popularIdsTemp) {
                    if (obj.kitchenId == popularIdsTemp[i]) {
                        foundMatch = true
                        const index = popularIdsTemp.indexOf(popularIdsTemp[i]);
                        if (index > -1) {
                            popularIdsTemp.splice(index, 1);
                        }
                    }
                }
                return foundMatch;

            })
            let popularRestaurantsArray = arrayOfRestaurants.map(obj => {
                for (let i in popularIds) {
                    if (obj.kitchenId == popularIds[i]) {
                        obj.popularity = popular.favorites[popularIds[i]]
                        console.log(popular.favorites[popularIds[i]])
                    }
                }
                return obj
            }).sort((a, b) => b.popularity - a.popularity)
            
            var component = this;

            var sr = component.shadowRoot;

            var anchor = sr.getElementById('restaurantlist');
            anchor.innerHTML = "";
            console.log(popularRestaurantsArray)


            popularRestaurantsArray.forEach(obj => {
                var element = document.createElement('restaurant-element');
                element.setAttribute("restaurant", obj.name);
                element.setAttribute("type", obj.type);
                anchor.appendChild(element);
            })
            
            let label = sr.getElementById('caption')
            label.innerHTML = "Popular in your area ... "
            
            if (notify) this.showNotification(sr, 'New popular list in your area!')
        }
    }

    showNotification(shadowRoot, notificationText) {
        var notifcationArea = shadowRoot.getElementById('notificationarea');
        notifcationArea.innerHTML = '';

        var message = document.createElement('div');
        message.innerHTML = notificationText
        message.className = 'notification';
        notifcationArea.appendChild(message);

        setTimeout(function(){
            message.remove()
        }, 5000);
    }

    randomRestaurantList(restaurants) {

        var arr = [];
        let maxRandomLength
        if (restaurants.length > 5) {
            maxRandomLength = 5
        } else {
            maxRandomLength = restaurants.length
        }
        while (arr.length < maxRandomLength) {
            var r = Math.floor(Math.random() * this.restaurants.length - 1) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }

        var component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');
        anchor.innerHTML = "";


        arr.forEach(function (index) {
            var restaurant = restaurants[index];
            var element = document.createElement('restaurant-element');
            element.setAttribute("restaurant", restaurant.name);
            element.setAttribute("type", restaurant.type);
            anchor.appendChild(element);
        })
        let label = sr.getElementById('caption')
        label.innerHTML = "Random recommendation of restaurants"
    }

    showRestaurantOptions(event) {

        let id = event.currentTarget.id;

        // let id = event.path[1].id;

        let component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');
        anchor.innerHTML = "";

        var cap = 'cafes ...';

        if (id != 'cafe') {
            cap = id + ' restaurants ...';
        }

        this.setCaption(cap);

        this.restaurants.forEach(function (restaurant) {
            if (restaurant.type == id) {
                var element = document.createElement('restaurant-element');
                element.setAttribute("restaurant", restaurant.name);
                element.setAttribute("type", restaurant.type);
                anchor.appendChild(element);
            }
        })
    }

    setMode(mode) {
        this.mode = mode;

        var imagestring = this.imagename;

        if (this.mode == 'active') {
            imagestring = imagestring + this.SELECTEDSUFFIX;
        } else {
            imagestring = imagestring + this.DESELECTEDSUFFIX;
        }

        this.buttonimage.src = './images/' + imagestring;
    }

    setEnabled() {
        this.setMode('active');
    }

    setDisabled() {
        this.setMode('inactive');
    }

    setCaption(caption) {
        var sr = this.shadowRoot;
        var cap = sr.getElementById('caption');
        cap.innerHTML = caption;
    }

    showTaste() {

        let component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');


        anchor.addEventListener('RESTAURANT-SELECTION', e => {
            console.log(e.detail.eventData.restaurant);
            anchor.innerHTML = "";

            var selected = e.detail.eventData.restaurant;

            component.restaurants.forEach(function (restaurant) {
                if (restaurant.name == selected) {

                    component.setCaption('Menu for ' + restaurant.name + ' ...');

                    restaurant.menu.forEach(function (menuitem) {
                        let entry = document.createElement('menuitem-element');
                        entry.setAttribute('dish', menuitem.item);
                        entry.setAttribute('cost', menuitem.price);
                        entry.setAttribute('restaurant', restaurant.name);
                        entry.setAttribute('type', restaurant.type);
                        entry.setAttribute('kitchenId', restaurant.kitchenId);
                        anchor.appendChild(entry);
                    })
                }
            })
        });
    }
}


try {
    customElements.define('taste-element', Taste);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}