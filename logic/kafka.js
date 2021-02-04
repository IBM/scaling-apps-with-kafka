var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Openshift rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.strokeStyle = "#84827C";
ctx.rect(59, 1, 500, 500);
ctx.stroke();


// API Area
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.lineWidth = "0.5";
ctx.beginPath();
ctx.fillStyle = "#FDF9F0";
ctx.arc(60, 250, 40, 0, 2 * Math.PI);
ctx.stroke();
ctx.fill();

ctx.font = "10px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("API", 40, 240);
ctx.fillText("Gateway", 40, 260);

ctx.beginPath();
canvas_arrow(ctx,90, 275, 200, 425);
canvas_arrow(ctx,200, 425, 90, 275);

ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#CCCCCC";
ctx.fillText("RedHat OpenShift", 460, 20);

// Microservices Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([5, 3]);
ctx.strokeStyle = "#84827C";
ctx.rect(180, 180, 320, 140);
ctx.stroke();

ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.fillStyle = "#FFFFFF";
ctx.strokeStyle = "#FFFFFF";
ctx.rect(250, 170, 80, 20);
ctx.stroke();
ctx.fill();

ctx.font = "10px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Microservices", 260, 182);

// Order Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Order", 220, 240);
ctx.fillText("Service", 220, 260);




// Driver Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(300, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Courier", 320, 240);
ctx.fillText("Service", 320, 260);


// Kitchen Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(400, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Kitchen", 420, 240);
ctx.fillText("Service", 420, 260);

ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.fillStyle = "#FCD89D";
ctx.rect(269, 220, 22, 22);
ctx.rect(369, 220, 22, 22);
ctx.rect(469, 220, 22, 22);

ctx.stroke();
ctx.fill();

ctx.fillStyle = "#333333";
ctx.font = "12px Arial";

ctx.fillText("4", 276, 236);
ctx.fillText("2", 376, 236);
ctx.fillText("8", 476, 236);

ctx.stroke();

// Mongo rectangle
ctx.beginPath();
ctx.lineWidth = "1";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 50, 280, 50);
ctx.stroke();
console.log('drawing');

ctx.font = "12px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Mongo DB", 310, 80);


ctx.beginPath();
canvas_arrow(ctx, 240, 210, 240, 100);
canvas_arrow(ctx, 340, 210, 340, 100);
canvas_arrow(ctx, 440, 210, 440, 100);
canvas_arrow(ctx, 240, 100, 240, 210);
canvas_arrow(ctx, 340, 100, 340, 210);
canvas_arrow(ctx, 440, 100, 440, 210);
ctx.stroke();



// Kafka rectangle
ctx.beginPath();
ctx.lineWidth = "1";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 400, 280, 50);
ctx.stroke();
console.log('drawing');

ctx.font = "12px Arial";
ctx.fillStyle = "#333333";
ctx.fillText("Kafka", 324, 430);


ctx.beginPath();
canvas_arrow(ctx, 240, 400, 240, 290);
canvas_arrow(ctx, 340, 400, 340, 290);
canvas_arrow(ctx, 440, 400, 440, 290);
canvas_arrow(ctx, 240, 290, 240, 400);
canvas_arrow(ctx, 340, 290, 340, 400);
canvas_arrow(ctx, 440, 290, 440, 400);
ctx.stroke();

/* Kafka topics */

ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.fillStyle = "#FCD89D";
ctx.rect(210, 350, 60, 22);
ctx.rect(310, 350, 60, 22);
ctx.rect(410, 350, 60, 22);

ctx.stroke();
ctx.fill();

ctx.fillStyle = "#333333";
ctx.font = "12px Arial";

ctx.fillText("2000", 226, 366);
ctx.fillText("1000", 326, 366);
ctx.fillText("1000", 426, 366);

ctx.stroke();
// ctx.fill();


function canvas_arrow(context, fromx, fromy, tox, toy) {
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