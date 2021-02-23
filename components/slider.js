class Slider extends HTMLElement {

    static get observedAttributes() {
        return ['title','left','right'];
    }

    constructor() {
        super();
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
        console.log('Initializing ' + this.titletext.toLocaleUpperCase() + ' Slider Component');

        var sliderlabel = sr.getElementById("sliderlabel");
        sliderlabel.innerHTML = this.titletext;

        this.lefttext = this.getAttribute('left');
        var left = sr.getElementById("left");
        left.innerHTML = this.lefttext;

        this.righttext = this.getAttribute('right');
        var right = sr.getElementById("right");
        right.innerHTML = this.righttext;

        this.showSlider();
    }
    
    async showSlider() {
        var sr = this.shadowRoot;
    }
}

try {
    customElements.define('slider-element', Slider);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
