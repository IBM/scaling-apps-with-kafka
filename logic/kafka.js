var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Openshift rectangle
ctx.beginPath();
ctx.lineWidth = "0.2";
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
ctx.fillStyle = "#84827C";
ctx.fillText("API", 40, 240);
ctx.fillText("Gateway", 40, 260);

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

// Order Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#84827C";
ctx.fillText("Order", 220, 240);
ctx.fillText("Service", 220, 260);

ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.fillStyle = "#FCD89D";
ctx.rect(269, 220, 22, 22);
ctx.stroke();
ctx.fill();


// Driver Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(300, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#84827C";
ctx.fillText("Courier", 320, 240);
ctx.fillText("Service", 320, 260);

ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.fillStyle = "#FCD89D";
ctx.rect(369, 220, 22, 22);
ctx.stroke();
ctx.fill();


// Kitchen Rectangle
ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(400, 210, 80, 80);
ctx.stroke();

ctx.font = "10px Arial";
ctx.fillStyle = "#84827C";
ctx.fillText("Kitchen", 420, 240);
ctx.fillText("Service", 420, 260);


ctx.beginPath();
ctx.lineWidth = "0.5";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.fillStyle = "#FCD89D";
ctx.rect(469, 220, 22, 22);
ctx.stroke();
ctx.fill();

// Mongo rectangle
ctx.beginPath();
ctx.lineWidth = "1";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 50, 280, 50);
ctx.stroke();
console.log('drawing');

ctx.font = "12px Arial";
ctx.fillStyle = "#84827C";
ctx.fillText("Mongo DB", 310, 80);


// Kafka rectangle
ctx.beginPath();
ctx.lineWidth = "1";
ctx.setLineDash([]);
ctx.strokeStyle = "#CFB2A6";
ctx.rect(200, 400, 280, 50);
ctx.stroke();
console.log('drawing');

ctx.font = "12px Arial";
ctx.fillStyle = "#84827C";
ctx.fillText("Kafka", 324, 430);