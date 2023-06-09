// Create a socket connection
const socket = io();

// DOM elements
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatTime = document.getElementById('chat-time');

// User email
const user = email;
//full name
const firstname = fname;
const lastname = lname;
const fullName = firstname + "." +  lastname.charAt(0)
// Room id
const roomId = id;

// Emit 'new-user' event with user email
socket.emit('new-user', { fullName: fullName, user: user, roomId: roomId });

// Listen for 'chat-message' event
socket.on('chat-message', data => {
    appendChatMessage(data.user, data.message, false); // Received message is not your own
});

//Listen for 'user-connected' event
socket.on('user-connected', data => {
    appendChatMessage(data.fullName, "joined"); // Received message is a joined message
});

// Submit form event listener
chatForm.addEventListener('submit', async e => {
    e.preventDefault();
    const chat = chatInput.value.trim();
    if (chat !== "") {
        if (containsEmoji(chat)) {
            displayWarning("Emojis are not allowed. Please remove the emoji and try again.");
            return;
        }
        if (chat.length > 60) {
            displayWarning("Message has too many characters. Please retype.");
            return;
        }
        appendChatMessage(fullName, chat, true); // Your message is marked as your own
        socket.emit('send-chat-message', { message: chat, roomId: roomId });
        chatInput.value = '';
        await sendMessageToServer(getCurrentTime(), chat, user, roomId);
    }
});
// Function to display warning message
function displayWarning(message) {
    // Remove previous warning message
    const previousWarning = chatContainer.querySelector('.warning-message');
    if (previousWarning) {
        previousWarning.remove();
    }

    const warningElement = document.createElement('div');
    warningElement.innerText = message;
    warningElement.classList.add('warning-message');
    warningElement.style.color = 'red'; // Set the text color to red
    chatContainer.append(warningElement);
}

// Function to check if string contains an emoji
function containsEmoji(text) {
    const emojiPattern = /[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu;
    return emojiPattern.test(text);
}


// Function to append chat message to the chat container
// Function to append chat message to the chat container
function appendChatMessage(user, message, isOwnMessage) {
    const chatElement = document.createElement('div');

    if (isOwnMessage) {
        const previousWarning = chatContainer.querySelector('.warning-message');
        if (previousWarning) {
            previousWarning.remove();
        }

        const highlightedMessage = getPing(message);
        if(highlightedMessage !== message){
            chatElement.classList.add('highlight-chat');
        }
        chatElement.innerHTML = `<span class="user">${user}:</span> ${highlightedMessage}`;
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
        const highlightedMessage = getPing(message);

        chatElement.innerHTML = `<span class="user">${user}:</span> ${highlightedMessage}`;
        chatElement.classList.add('received-message');

        // Check if the message contains a ping
        if (highlightedMessage !== message) {
            chatElement.classList.add('highlight-chat');
        }
    }

    chatContainer.append(chatElement);
}

// Function to get the pinged message
function getPing(message) {
    if (message.includes(`@${fullName.toLowerCase()}`)) {
        const highlightedMessage = message.replace(`@${fullName.toLowerCase()}`, `<span class="highlight">${fullName}</span>`);
        return highlightedMessage;
    }
    return message;
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
                roomId,
                fullName
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

function getPing(message) {
    if (message.includes(`@${fullName.toLowerCase()}`)) {
        const highlightedMessage = message.replace(`@${fullName.toLowerCase()}`, `<span class="highlight">${fullName}</span>`);
        return highlightedMessage;
    }
    return message;
}


