const notificationContainer = document.getElementById('notificationArea');

let loc = window.location;
let wsurl = "ws://" + loc.host + loc.pathname

let client = new WebSocket(wsurl);

client.onmessage = (event) => {
  console.log('received');
  console.log(event.data);
  let messageObject = processMessage(JSON.parse(event.data));
  console.log(messageObject);
  if (messageObject.status) {
    showMessageDOM(notificationContainer, messageObject.message);
  }
};
