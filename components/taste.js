class Taste extends HTMLElement {

    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'

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

        let outcome = await fetch('./components/restaurants.json')
        this.test = await outcome.text();
        this.restaurants = JSON.parse(this.test);
    }

    randomRestaurantList() {

    }

    showRestaurantOptions(event) {

        let id = event.path[1].id;

        let component = this;

        var sr = component.shadowRoot;

        var anchor = sr.getElementById('restaurantlist');
        anchor.innerHTML = "";

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

    showTaste() {

    }
}


try {
    customElements.define('taste-element', Taste);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}