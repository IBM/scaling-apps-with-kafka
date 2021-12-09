function processMessage(message_from_ws) {
    if (message_from_ws.status == 200 && message_from_ws.data) {
        if (message_from_ws.data.message_sent && message_from_ws.data.status == 'message_sent')
        return {
            status: true,
            message: message_from_ws.data.message_sent
        }
    }

    return {
        status: false,
        reason: "Unable to process message received from server.",
        message: message_from_ws
    }
}

function showMessageDOM(container, notification_text) {
    let divNotification = document.createElement('div');
    divNotification.className = "notificationText";
    divNotification.innerHTML = notification_text;
    container.prepend(divNotification);
}

module.exports = {
    processMessage,
    showMessageDOM
}
