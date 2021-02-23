class Architecture extends HTMLElement {

    static get observedAttributes() {
        return ['title', 'left', 'right'];
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
        this.drawMongo(this.context);
        this.drawKafka(this.context);
        this.drawKafkaTopics(this.context);
    }

    log(string) {
        console.log(string);
    }

    drawOpenShift() {
        this.log('Drawing OpenShift Box');
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
        this.log('Drawing API Gateway');

        var radius = 40;

        ctx.lineWidth = "1";
        ctx.beginPath();
        ctx.fillStyle = "#FDF9F0";
        ctx.arc(this.x, 240, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.font = "10px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("API", this.x-20, 235);
        ctx.fillText("Gateway", this.x-20, 255);

        ctx.beginPath();
        this.drawArrow(ctx, 110, 275, 200, 415);
        this.drawArrow(ctx, 200, 415, 110, 275);
        this.drawArrow(ctx, 0, 240, this.x-radius, 240);
        ctx.stroke();
    }

    drawKafka(ctx) {
        this.log('Drawing Kakfa Box');
        // Kafka rectangle
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = "#CFB2A6";
        ctx.rect(200, 400, 280, 40);
        ctx.stroke();
        ctx.font = "12px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("Kafka", 324, 425);
    }

    drawMongo(ctx) {
        this.log('Drawing Mongo Box');
        // Mongo rectangle
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = "#CFB2A6";
        ctx.rect(200, 40, 280, 40);
        ctx.stroke();
        ctx.font = "12px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("Mongo DB", 310, 65);

        ctx.beginPath();
        this.drawArrow(ctx, 240, 190, 240, 80);
        this.drawArrow(ctx, 340, 190, 340, 80);
        this.drawArrow(ctx, 440, 190, 440, 80);
        this.drawArrow(ctx, 240, 80, 240, 200);
        this.drawArrow(ctx, 340, 80, 340, 200);
        this.drawArrow(ctx, 440, 80, 440, 200);
        ctx.stroke();

    }

    drawMicroservices(ctx) {
        this.log('Drawing MicroServices');
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = "#84827C";
        ctx.rect(180, 180, 320, 120);
        ctx.stroke();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#FFFFFF";
        ctx.rect(250, 170, 80, 20);
        ctx.stroke();
        ctx.fill();
        ctx.font = "10px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText("Microservices", 260, 182);
        this.drawService(ctx, 200, 200, 'Order', 8);
        this.drawService(ctx, 300, 200, 'Driver', 4);
        this.drawService(ctx, 400, 200, 'Kitchen', 2);
    }

    drawService(ctx, x, y, label, workers) {
        this.log('Drawing ' + label + ' service');
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = "#CFB2A6";
        ctx.rect(x, y, 80, 80);
        ctx.stroke();
        ctx.font = "10px Arial";
        ctx.fillStyle = "#333333";
        ctx.fillText(label, x + 10, y + 30);
        ctx.fillText("Service", x + 10, y + 50);

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash([]);
        ctx.strokeStyle = "#CFB2A6";
        ctx.fillStyle = "#FCD89D";
        ctx.rect(x + 69, y + 20, 22, 22);
        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "#333333";
        ctx.font = "12px Arial";
        ctx.fillText(workers, x + 76, y + 36);
        ctx.stroke();
    }

    drawKafkaTopics(ctx) {
        this.log('Drawing Kafka Topics');
        ctx.beginPath();
        this.drawArrow(ctx, 240, 400, 240, 280);
        this.drawArrow(ctx, 340, 400, 340, 280);
        this.drawArrow(ctx, 440, 400, 440, 280);
        this.drawArrow(ctx, 240, 290, 240, 400);
        this.drawArrow(ctx, 340, 290, 340, 400);
        this.drawArrow(ctx, 440, 290, 440, 400);
        ctx.stroke();


        ctx.beginPath();
        ctx.lineWidth = "0.5";
        ctx.setLineDash([]);
        ctx.strokeStyle = "#CFB2A6";
        ctx.fillStyle = "#FCD89D";
        ctx.rect(210, 340, 60, 22);
        ctx.rect(310, 340, 60, 22);
        ctx.rect(410, 340, 60, 22);

        ctx.stroke();
        ctx.fill();

        ctx.fillStyle = "#333333";
        ctx.font = "12px Arial";

        ctx.fillText("9000", 226, 356);
        ctx.fillText("1000", 326, 356);
        ctx.fillText("1000", 426, 356);

        ctx.stroke();
    }

    drawArrow(context, fromx, fromy, tox, toy) {
        var headlen = 10; // length of head in pixels
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