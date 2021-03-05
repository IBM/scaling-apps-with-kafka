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
        // show stored locally then update
        this.showOrders();
        this.updateLocalOrdersFromServer();
    }

    showOrders() {
        var orders = localStorage.getItem('KAFKA-ORDERS');

        var orderlist = JSON.parse(orders);
        this.renderOrders(orderlist)
    }

    renderOrders(orderlist) {
        var sr = this.shadowRoot;

        var anchor = sr.getElementById('orderList');

        // remove currently rendered orders
        while (anchor.firstChild) {
            anchor.removeChild(anchor.firstChild);
        }

        try {
            orderlist.forEach(element => {
                console.log(element);
                var order = document.createElement('order-element');
                order.setAttribute('dish', element.dish);
                order.setAttribute('cost', element.totalPrice);
                order.setAttribute('type', element.type);
                order.setAttribute('status', element.status);
                anchor.appendChild(order);
            });
        } catch (err) {
            console.error(err)
        }
    }

    async updateLocalOrdersFromServer() {
        // check for orders on server
        let userId = localStorage.getItem("userId")
        let ordersResponse = await getOrdersOfUser(userId)

        if (ordersResponse != "noop") {
            if (ordersResponse.status == "success") {
                let orderlist = ordersResponse.docs
                // clear and store current orders from server
                localStorage.removeItem('KAFKA-ORDERS')
                localStorage.setItem('KAFKA-ORDERS', JSON.stringify(orderlist))
                this.renderOrders(orderlist)
            }
        }
    }
}


try {
    customElements.define('receipt-element', Receipt);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}