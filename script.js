// Create a socket connection
const socket = io();

// DOM elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatTime = document.getElementById('chat-time');

// User email
const user = email;

// Emit 'new-user' event with user email
socket.emit('new-user', user);

// Listen for 'chat-message' event
socket.on('chat-message', data => {
    appendChatMessage(data.user, data.message);
});

// Submit form event listener
chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const chat = chatInput.value.trim();
    if (chat !== "") {
        appendChatMessage(user, chat);
        socket.emit('send-chat-message', chat);
        socket.emit('chat-time', getCurrentTime());
        chatInput.value = '';
        await sendMessageToServer(getCurrentTime(), chat, user);
    }
});

// Function to append chat message to the chat container
function appendChatMessage(user, message) {
    const chatElement = document.createElement('div');
    chatElement.innerText = `${user}: ${message}`;
    chatContainer.append(chatElement);
}

// Function to send chat message to the server
async function sendMessageToServer(time, chat, user) {
    try {
        const response = await fetch('/chat/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time,
                chat,
                user
            })
        });
        const data = await response.json();
        console.log(data); // Optional: Handle the response data
    } catch (error) {
        console.error('Failed to send the chat message:', error);
    }
}

// Function to get the current time
function getCurrentTime() {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds();
    const minute = currentDate.getMinutes();
    const hour = currentDate.getHours();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = currentDate.getFullYear();
    return `${hour}:${minute}:${seconds}, ${day}-${month}-${year}`;
}
