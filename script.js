// Create a socket connection
const socket = io();

// DOM elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatTime = document.getElementById('chat-time');

// User email
const user = email;
// Room id
const roomId = id;

// Emit 'new-user' event with user email
socket.emit('new-user', { user: user, roomId: roomId });

// Listen for 'chat-message' event
socket.on('chat-message', data => {
    appendChatMessage(data.user, data.message, false); // Received message is not your own
});

//Listen for 'user-connected' event
socket.on('user-connected', data => {
    appendChatMessage(data.user, "joined"); // Received message is a joined message
});

// Submit form event listener
chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const chat = chatInput.value.trim();
    if (chat !== "") {
        appendChatMessage(user, chat, true); // Your message is marked as your own
        socket.emit('send-chat-message', { message: chat, roomId: roomId });
        chatInput.value = '';
        await sendMessageToServer(getCurrentTime(), chat, user, roomId);
    }
});

// Function to append chat message to the chat container
function appendChatMessage(user, message, isOwnMessage) {
    const chatElement = document.createElement('div');
    
    if (isOwnMessage) {
        if(message.length > 50){
            throw new Error("to many characters")
        }
        chatElement.innerText = `${user}: ${message}`;
        chatElement.classList.add('own-message');
    } else if (message === 'joined') {
        // Remove previous "joined" message from the current user
        const previousJoinMessage = chatContainer.querySelector(`.join-message[data-user="${user}"]`);
        if (previousJoinMessage) {
            previousJoinMessage.remove();
        }

        chatElement.innerText = `${user} has joined the chat`;
        chatElement.classList.add('join-message');
        chatElement.setAttribute('data-user', user);
    } else {
        chatElement.innerText = `${user}: ${message}`;
        chatElement.classList.add('received-message');
    }

    chatContainer.append(chatElement);
}


// Function to send chat message to the server
async function sendMessageToServer(time, chat, user) {
    try {
        const response = await fetch('/project/:id/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                time,
                chat,
                user,
                roomId
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
