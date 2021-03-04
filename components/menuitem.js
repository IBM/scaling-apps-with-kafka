class MenuItem extends HTMLElement {

    static get observedAttributes() {
<<<<<<< HEAD
        return ['entry', 'cost', 'restaurant', 'type'];
=======
        return ['entry', 'cost', 'restaurant', 'kitchenId'];
>>>>>>> Add more details to order document and integrate with frontend
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

        var button = sr.getElementById('order');
        button.onclick = this.placeOrder.bind(this);
    }

    storeOrder(order){

        var orders = localStorage.getItem('KAFKA-ORDERS');

        var orderlist;

        if(orders == null){
            orderlist = [];  
        }else{
            orderlist = JSON.parse(orders);
        }

        orderlist.push(order);  
        localStorage.setItem('KAFKA-ORDERS',JSON.stringify(orderlist));
    }


    async placeOrder(e) {

        var dish = this.getAttribute('dish');
        var cost = this.getAttribute('cost');
        var type = this.getAttribute('type');
        var restaurant = this.getAttribute('restaurant');
        var kitchenId = this.getAttribute('kitchenId');

        let orderinfo = {
            'dish': dish,
            'totalPrice': cost,
            'restaurant': restaurant,
<<<<<<< HEAD
            'type': type,
=======
            kitchenId,
>>>>>>> Add more details to order document and integrate with frontend
            'status': 'ORDERED'
        };

        let createOrderRequest = await createOrder(orderinfo)
        if (createOrderRequest == "noop") {
            this.storeOrder(orderinfo);
        } else {
            if (createOrderRequest.status == "orderCreated") {
                console.log(createOrderRequest)
                this.storeOrder(orderinfo); // change orderinfo to backend data instead
            }
        }

        var component = this;

        /* Send an event for this order, so that other parts of the system can react */

        var customEvent = new CustomEvent('ORDER-PLACED', {
            detail: {
                eventData: {
                    "order": orderinfo
                }
            },
            bubbles: true
        });

        component.dispatchEvent(customEvent);

        console.log(orderinfo);

    }
}


try {
    customElements.define('menuitem-element', MenuItem);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}