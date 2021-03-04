class Receipt extends HTMLElement {

    static get observedAttributes() {
        return ['imagename','viewname','mode'];
    }

    constructor() {
        super();
        console.log('Initializing Receipt Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/receipt.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showOrders();
    }

    showOrders() {
        var orders = localStorage.getItem('KAFKA-ORDERS');

        var orderlist = JSON.parse(orders);

        var sr = this.shadowRoot;

        var anchor = sr.getElementById('orderList');

        orderlist.forEach(element => {
            console.log(element);
            var order = document.createElement('order-element');
            order.setAttribute('dish', element.dish);
            order.setAttribute('cost', element.cost);
            order.setAttribute('type', element.type);
            order.setAttribute('status', element.status);
            anchor.appendChild(order);
        });
    }
}


try {
    customElements.define('receipt-element', Receipt);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}