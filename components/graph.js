class Graph extends HTMLElement {

    static get observedAttributes() {
        return ['title','left','right'];
    }

    constructor() {
        super();
        console.log('Initializing Graph Component');
        let templateContent = '<div></div>';
        this.labels = [];
        this.datapath = "";
        const shadow = this.attachShadow({
            mode: 'open'
        })
    }

    async connectedCallback() {
        let res = await fetch('./components/graph.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        this.startGraph();
    }

    //generate random data
    data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    async updateData(){
        let min = 40;
        let max = 60;
        let value = Math.floor(Math.random() * (max - min) + min);
        this.data.push(value);
        this.data.shift();
        while(true) {
            this.percent.innerText = "Current Capacity: " + this.data[this.data.length - 1] + "%";
            value = Math.floor(Math.random() * (max - min) + min)
            this.data.push(value);
            this.data.shift();
            await this.sleep(150);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    

    draw(){

        let brown = "#cfb1a4";
        let orange = "#fcd89d";
        let blue = "#569BC6";
        let grey = "lightgray";


        var canvas = this.canvas;
        var context = this.context;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.moveTo(0, 0);
        
        //draw the graph line
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = blue;
        context.moveTo(0, canvas.height - ((canvas.height * this.data[0]) / 100));
        for(let i = 1; i < 19; i++){
            context.lineTo(i * ((canvas.width - 40) / 18), canvas.height - ((canvas.height * this.data[i]) / 100));
        }
        context.stroke();
    
        context.strokeStyle = brown;
    
        //fill
        context.globalAlpha = 0.2;
        context.fillStyle = "#569BC6";
        context.lineTo(canvas.width - 40, canvas.height);
        context.lineTo(1, canvas.height);
        context.closePath();
        context.fill();

        context.globalAlpha = 1;
    
        //outline frame
        // context.strokeRect(0, 0, canvas.width - 30, canvas.height);
        
        //markers
        context.beginPath();
        
        context.lineWidth = 0.2;
        var horizontalLine = canvas.height / 10;
        for (let index = 1; index < 10; index++) {
            context.moveTo(0, horizontalLine * index);
            context.strokeStyle = brown;
            context.lineTo(canvas.width - 40, (horizontalLine * index) + 0.2);
            context.moveTo(0, 0);
        }

        context.stroke();  

        context.font = "12px Arial bold";
        for (let index = 1; index < 10; index++) {
            context.strokeStyle = 'white';
            context.strokeText(100 - (index * 10), canvas.width - 20, (horizontalLine * index) - 1);
        }

        context.strokeText("0", canvas.width - 16, canvas.height - 1);
        // context.strokeText("100%", canvas.width - 20, 7.2);
    }
    
    async startGraph() {
        var sr = this.shadowRoot;
        this.canvas = sr.getElementById("graph");
        this.context = this.canvas.getContext("2d");
        this.percent = sr.getElementById("percent");
        this.updateData();
        this.render(this.context);
        
    }


    render(){ 
        this.draw();
        requestAnimationFrame(this.render.bind(this));
    }
}

try {
    customElements.define('graph-element', Graph);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}