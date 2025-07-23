# One-to-One-Chat-Application

This is a simple real-time one-to-one chat app using Node.js, Express, Socket.IO, and PM2.

## Features

- Real-time messaging between users.
- Simple HTML frontend.
- Process management using PM2 in cluster mode.
- Middleware-based error handling.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your_repo_url>
cd one-to-one-chat-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start with Node.js
```bash
node index.js
```

### 4. Start using PM2 in cluster mode
```bash
npm install pm2 -g
pm2 start index.js -i max --name chat-app
```

## 🧪 Testing Process

You can test the app locally in the following ways:

### ✅ Real-time Chat Testing

1. Open `http://localhost:3000` in one browser tab and enter a username.
2. Open a **second tab or different browser** with `http://localhost:3000` and enter a different username.
3. Send a message from one tab — it should appear instantly in **both**.
4. Try sending emojis using the 😊 button.
5. Click the 📎 (file) button and upload an image or file — it will be displayed or downloaded in both tabs.

### ✅ Cluster Mode Testing (PM2)

1. Start the app in cluster mode using PM2 (`pm2 start server.js -i max`)
2. Open multiple browser tabs and send messages
3. Ensure messages work across all tabs, regardless of CPU core

---

## 📝 Notes

- Express is used to serve the static frontend (`index.html`)
- Socket.IO handles real-time communication
- Emoji support is powered by [emoji-button](https://github.com/joeattardi/emoji-button)
- PM2 is optional but recommended for production

---

## 👨‍💻 Author

**Neeraj Mehra** 🚀  
