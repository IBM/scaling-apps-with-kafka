class Slider extends HTMLElement {

    static get observedAttributes() {
        return ['title','viewname','mode'];
    }

    constructor() {
        super();
        console.log('Initializing Slider Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/slider.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.titletext = this.getAttribute('title');
        console.log(this.titletext);
        var sliderlabel = sr.getElementById("sliderlabel");
        sliderlabel.innerHTML = this.titletext;
        this.showSlider();
    }
    
    async showSlider() {
        var sr = this.shadowRoot;
        // var phone = this;
        // var basebutton = sr.getElementById('basebutton');
        // var mobileview = sr.getElementById('mobileview');
        // var navigation = sr.getElementById('mobilenavigation');
        // // var apptiles = sr.getElementById('APPTILES');
        // basebutton.addEventListener('click', e => {
        //     mobileview.innerHTML = '<homescreen-element id="HOMESCREEN"></homescreen-element>';
        //     phone.hideNavigation();
        // });
        // phone.showNavigation();
    }
}

try {
    customElements.define('slider-element', Slider);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
