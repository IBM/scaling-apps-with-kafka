class Phone extends HTMLElement {

    constructor() {
        super();
        console.log('Initializing Phone Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/phone.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showPhone();
    }

    getMobileView(){
        var sr = this.shadowRoot;
        var mobileview = sr.getElementById('mobileview');
        return mobileview;
    }

    showNavigation(){
        var sr = this.shadowRoot;
        var nav = sr.getElementById("mobilenavigation");
        nav.style.display = "flex";
    }

    hideNavigation(){
        var sr = this.shadowRoot;
        var nav = sr.getElementById("mobilenavigation");
        nav.style.display = "none";
    }
    
    async showPhone() {
        var sr = this.shadowRoot;
        var phone = this;
        var basebutton = sr.getElementById('basebutton');
        var mobileview = sr.getElementById('mobileview');
        var navigation = sr.getElementById('mobilenavigation');
        // var apptiles = sr.getElementById('APPTILES');
        basebutton.addEventListener('click', e => {
            mobileview.innerHTML = '<homescreen-element id="HOMESCREEN"></homescreen-element>';
            phone.hideNavigation();
        });
        phone.showNavigation();
    }
}

try {
    customElements.define('phone-element', Phone);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
