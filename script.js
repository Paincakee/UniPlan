const socket = io()
const chatContainer = document.getElementById('chat-container')
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')
const chatTime = document.getElementById('chat-time')

const user = email

socket.emit('new-user', user)


socket.on('chat-message', data => {
    AppendChat(`${data.user}: ${data.message}`)
})

chatForm.addEventListener('submit', async e => {
    e.preventDefault()
    const currentDate = new Date();

    // Get the minute, hour, day, month, and year components
    const seconds = currentDate.getSeconds()
    const minute = currentDate.getMinutes()
    const hour = currentDate.getHours()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1 // Months are zero-based, so add 1
    const year = currentDate.getFullYear()

    // Format the components as "minute-hour, day-month-year"
    const time = `${hour}:${minute}:${seconds}, ${day}-${month}-${year}`

    const chat = chatInput.value
    AppendChat(`you: ${chat}`)
    socket.emit('send-chat-message', chat)
    socket.emit('chat-time', time)
    chatInput.value = ''
    chatTime.value = time

    const sendMessage = async (time, chat, user) => {
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
        })
        const data = await response.json();
    }

    await sendMessage(time, chat, user)
})  

function AppendChat(chat) {
    const chatElement = document.createElement('div')
    chatElement.innerText = chat
    chatContainer.append(chatElement)
}
