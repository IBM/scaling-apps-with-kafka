class Restaurant extends HTMLElement {

    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'

    static get observedAttributes() {
        return ['restaurant', 'type'];
    }

    constructor() {
        super();
        console.log('Initializing Restauarant Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/restaurant.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showTaste();
    }

    showRestaurantOptions(event) {

        let id = event.path[1].id;

        this.restaurants.forEach(function (restaurant) {
            if (restaurant.type == id) {
                console.log(restaurant)
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

    showTaste() {
        var customElement = this;
        this.onclick = this.selectRestaurant.bind(this);

        this.restaurantname = customElement.getAttribute('restaurant');
        this.restauranttype = customElement.getAttribute('type');

        var sr = this.shadowRoot;

        var r = sr.getElementById('restaurant');
        r.innerHTML = this.restaurantname;

        var i = sr.getElementById('image');

        switch (this.restauranttype) {

            case "vegan":
                i.src = "../images/sprout.svg";
                break;

            case "noodle":
                i.src = "../images/noodle-bowl.svg";
                break;

            case "cafe":
                i.src = "../images/cafe.svg";
                break;

            case "seafood":
                i.src = "../images/fish.svg";
                break;
        }
    }

    selectRestaurant(e) {
        console.log(e);

        var component = this;

        var customEvent = new CustomEvent('RESTAURANT-SELECTION', {
            detail: {
                eventData: {
                    "restaurant": component.restaurantname 
                }
            },
            bubbles: true
        });
        component.dispatchEvent(customEvent);
    }
}


try {
    customElements.define('restaurant-element', Restaurant);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}