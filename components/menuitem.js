class MenuItem extends HTMLElement {

    static get observedAttributes() {
        return ['entry', 'cost'];
    }

    constructor() {
        super();
        console.log('Initializing MenuItem Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/menuitem.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showItem();
    }

    showItem() {
        var sr = this.shadowRoot;
        var dish = sr.getElementById('dish');
        var cost = sr.getElementById('cost');

        var d = this.getAttribute('dish');
        var c = this.getAttribute('cost');

        dish.innerHTML = d;
        cost.innerHTML = '$' + c;
    }
}


try {
    customElements.define('menuitem-element', MenuItem);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}