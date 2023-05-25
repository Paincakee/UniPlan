const socket = io()
const chatContainer = document.getElementById('chat-container')
const chatForm = document.getElementById('chat-form')
const chatInput = document.getElementById('chat-input')


const user = email
socket.emit('new-user', user)


socket.on('chat-message', data => {
    AppendChat(`${data.user}: ${data.message}`)
})

chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const currentDate = new Date();

    // Get the minute, hour, day, month, and year components
    const minute = currentDate.getMinutes()
    const hour = currentDate.getHours()
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1 // Months are zero-based, so add 1
    const year = currentDate.getFullYear()

    // Format the components as "minute-hour, day-month-year"
    const time = `${hour}:${minute}, ${day}-${month}-${year}`

    const chat = chatInput.value
    ChatSave(time, chat)
    AppendChat(`you: ${chat}`)
    socket.emit('send-chat-message', chat)
    socket.emit('chat-time', time)
    chatInput.value = ''
})

function AppendChat(chat) {
    const chatElement = document.createElement('div')
    chatElement.innerText = chat
    chatContainer.append(chatElement)
}

async function ChatSave(time, chat) {
    const save = await db.sql("sql/chat/saveChat", {
        userId: email,
        chat: chat,
        time: time
    })

    console.log("send");
}