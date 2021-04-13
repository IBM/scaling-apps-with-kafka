class Order extends HTMLElement {

    static get observedAttributes() {
        return ['dish', 'cost', 'status', 'icon'];
    }

    constructor() {
        super();
        console.log('Initializing Order Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/order.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();

        var dish = this.getAttribute('dish');
        var cost = this.getAttribute('cost');
        var type = this.getAttribute('type');
        var status = this.getAttribute('status');

        var dishElement = sr.getElementById('dish');
        dishElement.innerHTML = dish;

        var costElement = sr.getElementById('cost');
        costElement.innerHTML = '$' + cost;

        var statusElement = sr.getElementById('status');
        statusElement.innerHTML = status;


    }
}


try {
    customElements.define('order-element', Order);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}