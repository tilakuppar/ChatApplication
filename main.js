const socket = new WebSocket('ws://localhost:4000');

const clients = document.getElementById('total_client');
const message_container = document.getElementById('message-container');
const name_input = document.getElementById('name-ip');
const msg_form = document.getElementById('message-form');
const msg_input = document.getElementById('message-input');

socket.addEventListener('open', (event) => {
    console.log('WebSocket Connected');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'total-clients') {
        clients.innerText = `Total Clients: ${data.data}`;
    } else if (data.type === 'chat-message') {
        messageLI(false, data.data);
    }
});

msg_form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage();
});

function sendMessage() {
    const date = new Date();
    const data = {
        name: name_input.value,
        message: msg_input.value,
        dateTime: `${date.getHours()}:${date.getMinutes()}`
    };
    socket.send(JSON.stringify(data));
    messageLI(true, data);
}

function messageLI(isOwnMsg, data) {
    const element = `
    <li class="${isOwnMsg ? 'msg-right' : 'msg-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} ${data.dateTime}</span>
        </p>
    </li>
    `;
    message_container.innerHTML += element;
    msg_input.value = '';
}
