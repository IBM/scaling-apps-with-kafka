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

        this.restaurantname = customElement.getAttribute('restaurant');
        this.restauranttype = customElement.getAttribute('type');

        var sr = this.shadowRoot;

        var r = sr.getElementById('restaurant');
        r.innerHTML = this.restaurantname;

    }
}


try {
    customElements.define('restaurant-element', Restaurant);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}