const socket = io()
const chatContainer = document.getElementById('chat-container')
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')


const user = email
socket.emit('new-user', user)

socket.on('chat-message', data => {
    appendChat(`${data.user}: ${data.message}`)
})

chatForm.addEventListener('submit', e => {
    e.preventDefault()

    const chat = chatInput.value
    appendChat(`you: ${chat}`)
    socket.emit('send-chat-message', chat)
    chatInput.value = ''
})

function appendChat(chat){
    const chatElement = document.createElement('div')
    chatElement.innerText = chat
    chatContainer.append(chatElement)
}