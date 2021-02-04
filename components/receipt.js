class Receipt extends HTMLElement {

    SELECTEDSUFFIX = '-selected.svg';
    DESELECTEDSUFFIX = '-deselected.svg'

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
        this.showTaste();
    }

    setMode(mode){
        this.mode = mode;

        var imagestring = this.imagename;

        if(this.mode=='active'){
            imagestring = imagestring + this.SELECTEDSUFFIX;
        }else{
            imagestring = imagestring + this.DESELECTEDSUFFIX;
        }

        this.buttonimage.src = './images/' + imagestring;
    }

    setEnabled(){
        this.setMode('active');
    }

    setDisabled(){
        this.setMode('inactive');
    }

   showTaste(){

   }
}


try {
    customElements.define('receipt-element', Receipt);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}