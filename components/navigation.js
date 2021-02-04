class Navigation extends HTMLElement {

    activeview = '';

    getMobileView(){
        var sr = this.shadowRoot;

         // I don't like this being hard coded, but have stuggled to find a dynamic way for exampe: .childNodes.item("mobileview");

        var mobileview = sr.host.parentElement.childNodes[3];
        return mobileview;
    }

    constructor() {
        super();
        console.log('Initializing Navigation Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/navigation.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.showNavigation();
    }

    setAllButtonsDisabled(){
        var sr = this.shadowRoot;
        this.buttonRow = sr.getElementById('buttonrow');

        const buttonlist = Array.from(this.buttonRow.children);


        buttonlist.forEach(function(node){
            node.setDisabled();
        })
    }

    showNavigation(){
        var sr = this.shadowRoot;
        this.buttonRow = sr.getElementById('buttonrow');

        var navelement = this;

        this.buttonRow.addEventListener('NAV', e => {

            console.log(e)

            var id = e.detail.eventData.id;

            // console.log('HOMESCREEN RECIEVED EVENT FROM NAV BUTTON: ' + id.toLocaleUpperCase());

            this.setAllButtonsDisabled();

            var button = sr.getElementById(id);
            button.setEnabled();
            navelement.activeview = id;

            var mobileview = this.getMobileView();
            mobileview.innerHTML = "<" + id + "-element></" + id +"-element>";
        });
    }
}

try {
    customElements.define('navigation-element', Navigation);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}
