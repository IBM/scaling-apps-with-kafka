class Architecture extends HTMLElement {

    static get observedAttributes() {
        return ['title', 'left', 'right'];
    }

    TEXTCOLOR = '#333333'
    COUNTFILLCOLOR = '#FCD89D'
    MSLINECOLOR = '#CFB2A6'
    SERVICEHEIGHT = 60
    SERVICEWIDTH = 60

    MICROSERVICETOP =  170
    KAFKATOP = 380

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
        let res = await fetch('./components/architecture.html')
        var sr = this.shadowRoot;
        sr.innerHTML = await res.text();
        console.log('Initializing Architecture Component');
        this.showArchitecture();
    }

    async showArchitecture() {
        var sr = this.shadowRoot;
        this.canvas = sr.getElementById("architecture");
        this.context = this.canvas.getContext("2d");

        this.x = 90;
        this.y = 1;

        this.drawOpenShift();
        this.drawApiGateway(this.context);
        this.drawMicroservices(this.context);
        this.drawKafka(this.context);
    }

    log(string) {
        console.log(string);
    }

    drawOpenShift() {
        this.log(' - Drawing OpenShift Box');
        let ctx = this.context;
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "#84827C";
        ctx.rect(this.x, this.y, 500, 480);
        ctx.stroke();

        ctx.font = "10px Arial";
        ctx.fillStyle = "#CCCCCC";
        ctx.fillText("RedHat OpenShift", 495, 20);
    }

    drawApiGateway(ctx) {
        this.log(' - Drawing API Gateway');

        var radius = 30;

        var y = 300;

        ctx.lineWidth = "1";
        ctx.beginPath();
        ctx.fillStyle = "#FDF9F0";
        ctx.arc(this.x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.font = "10px Arial";
        ctx.fillStyle = this.TEXTCOLOR;
        ctx.fillText("API", this.x-20, y);
        ctx.fillText("Gateway", this.x-20, y+10);

        ctx.beginPath();
        this.drawArrow(ctx, 110, 275, 150, 215);
        this.drawArrow(ctx, 150, 215, 110, 275);
        this.drawArrow(ctx, 0, y, this.x-radius, y);
        ctx.stroke();
    }

    drawKafka(ctx) {
        this.log(' - Drawing Kakfa Box');

        // Kafka rectangle

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = this.MSLINECOLOR;
        ctx.rect(150, this.KAFKATOP, 380, 40);
        ctx.stroke();
        ctx.font = "12px Arial";
        ctx.fillStyle = this.TEXTCOLOR;
        ctx.fillText("Kafka", 325, 405);
    }

    drawDB(ctx, x, y, db){
        this.log(' - Drawing Mongo Box');
        // Mongo rectangle

        let HEIGHT = 40;
        let GAP = 70;

        let DISTANCE = 100;

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = this.MSLINECOLOR;
        ctx.rect(x, y-DISTANCE, this.SERVICEWIDTH, HEIGHT);

        ctx.stroke();
        ctx.font = "11px Arial";
        ctx.fillStyle = this.TEXTCOLOR;
        ctx.fillText(db, x + 5, y + 23-100);

        let microserviceCentre = this.SERVICEWIDTH/2;
 
        ctx.beginPath();
        this.drawArrow(ctx, x+microserviceCentre, y-DISTANCE+HEIGHT, x+microserviceCentre, y);
        this.drawArrow(ctx, x+microserviceCentre, y, x+microserviceCentre, y-DISTANCE+HEIGHT);
        ctx.stroke();
    }

    drawMicroservices(ctx) {
        this.log(' - Drawing MicroServices');
        ctx.beginPath();

        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#FFFFFF";
        ctx.rect(250, 170, this.SERVICEHEIGHT, 20);
        ctx.stroke();
        ctx.fill();
 
        this.drawService(ctx, 145, this.MICROSERVICETOP, 'Status', 'Redis', 8);
        this.drawService(ctx, 255, this.MICROSERVICETOP, 'Order', 'MongoDB', 4);
        this.drawService(ctx, 365, this.MICROSERVICETOP, 'Driver', 'MongoDB', 2);
        this.drawService(ctx, 475, this.MICROSERVICETOP, 'Kitchen', 'MongoDB', 2);
    }

    drawService(ctx, x, y, label, db, workers ) {
        this.log(' - Drawing ' + label + ' service');

        /* box for service */

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = this.MSLINECOLOR;
        ctx.rect(x, y, this.SERVICEWIDTH, this.SERVICEHEIGHT);
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillStyle = this.TEXTCOLOR;
        ctx.fillText(label, x + 10, y + 30);
        ctx.fillText("Service", x + 10, y + 50);


        /* worker count */

        let COUNTERWIDTH = 20;

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = this.MSLINECOLOR;
        ctx.fillStyle = this.COUNTFILLCOLOR;
        ctx.rect(x + this.SERVICEWIDTH - COUNTERWIDTH/2, y + 20, COUNTERWIDTH, COUNTERWIDTH);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = this.TEXTCOLOR;
        ctx.font = "12px Arial";
        ctx.fillText(workers, x + this.SERVICEWIDTH, y + 36);
        ctx.stroke();

        this.drawDB(ctx, x, y, db);

        let margin = 14;

        /* dashed line */

        ctx.lineWidth = "1";
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#84827C";
        ctx.rect(x-margin, y-114, this.SERVICEWIDTH+(margin*2), 190);
        ctx.stroke();

        this.drawKafkaTopic(ctx, x, y, 5000)
    }

    drawKafkaTopic(ctx, x, y, count){
        this.log(' - Drawing Kafka Topics');

        let TOPICARROW = 70;

        let middle = this.SERVICEWIDTH/2;

        // ctx.beginPath();
        this.drawArrow(ctx, x+middle, y + this.SERVICEHEIGHT, x+middle, this.KAFKATOP);
        this.drawArrow(ctx, x+middle, this.KAFKATOP, x+middle, y + this.SERVICEHEIGHT);
        ctx.stroke();

        /* Topic Count */

        let topicBox = this.KAFKATOP - this.SERVICEHEIGHT ;

        let topicHeight = 22;

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = this.MSLINECOLOR;
        ctx.fillStyle = this.COUNTFILLCOLOR;
        ctx.rect(x, topicBox, 60, topicHeight);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = this.TEXTCOLOR;
        ctx.font = "12px Arial";

        ctx.fillText(count, x+16, topicBox+15);

        ctx.stroke();
    }

    drawArrow(context, fromx, fromy, tox, toy) {
        var headlen = 10; 
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
}

try {
    customElements.define('architecture-element', Architecture);
} catch (err) {
    const h3 = document.createElement('h3')
    h3.innerHTML = err
    document.body.appendChild(h3)
}