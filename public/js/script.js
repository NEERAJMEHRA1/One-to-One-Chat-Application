// Emoji data
const emojiCategories = [
    {
        name: "Smileys & People",
        emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳']
    },
    {
        name: "Animals & Nature",
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜']
    }
];

class ChatPanel {
    constructor(panelElement, username) {
        this.panel = panelElement;
        this.username = username;
        this.messagesContainer = panelElement.querySelector('.messages');
        this.form = panelElement.querySelector('.message-form');
        this.input = panelElement.querySelector('.message-input');
        this.emojiBtn = panelElement.querySelector('.emoji-btn');
        this.emojiPicker = panelElement.querySelector('.emoji-picker');
        this.fileBtn = panelElement.querySelector('.file-btn');
        this.imageBtn = panelElement.querySelector('.image-btn');
        this.fileInput = panelElement.querySelector('.file-input');
        this.imageInput = panelElement.querySelector('.image-input');
        this.usernameDisplay = panelElement.querySelector('.username-display');

        this.usernameDisplay.textContent = username;
        this.lastDate = '';

        this.initEmojiPicker();
        this.setupEventListeners();
    }

    initEmojiPicker() {
        emojiCategories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('emoji-category');

            const titleElement = document.createElement('div');
            titleElement.classList.add('emoji-category-title');
            titleElement.textContent = category.name;
            categoryElement.appendChild(titleElement);

            category.emojis.forEach(emoji => {
                const emojiElement = document.createElement('span');
                emojiElement.classList.add('emoji-item');
                emojiElement.textContent = emoji;
                emojiElement.addEventListener('click', () => {
                    this.insertAtCursor(emoji);
                    this.emojiPicker.classList.remove('show');
                });
                categoryElement.appendChild(emojiElement);
            });

            this.emojiPicker.appendChild(categoryElement);
        });
    }

    insertAtCursor(text) {
        const startPos = this.input.selectionStart;
        const endPos = this.input.selectionEnd;
        const currentText = this.input.value;

        this.input.value = currentText.substring(0, startPos) + text + currentText.substring(endPos);
        this.input.selectionStart = this.input.selectionEnd = startPos + text.length;
        this.input.focus();
        this.autoResize();
    }

    autoResize() {
        this.input.style.height = 'auto';
        this.input.style.height = (this.input.scrollHeight) + 'px';
    }

    formatDate(date) {
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    formatTime(date) {
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    handleFileUpload(file, isImage = false) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fileInfo = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: isImage ? URL.createObjectURL(file) : '#'
                };
                resolve(fileInfo);
            }, 500);
        });
    }

    createMessageElement(msg, isOwnMessage) {
        const now = new Date(msg.timestamp);
        const currentDate = this.formatDate(now);

        if (this.lastDate !== currentDate) {
            const dateItem = document.createElement('li');
            dateItem.classList.add('date-label');
            dateItem.textContent = currentDate;
            this.messagesContainer.appendChild(dateItem);
            this.lastDate = currentDate;
        }

        const item = document.createElement('li');
        item.classList.add('message', isOwnMessage ? 'me' : 'other');

        // <div class="sender-name">${msg.sender}</div>
        let contentHTML = `
            <div class="text">${msg.text || ''}</div>
        `;

        if (msg.image) {
            contentHTML += `<img src="${msg.image.url}" class="message-image" alt="Sent image">`;
        } else if (msg.file) {
            contentHTML += `
                <div class="file-message">
                    <div class="file-icon">
                        <i class="far fa-file-alt"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${msg.file.name}</div>
                        <div class="file-size">${this.formatFileSize(msg.file.size)}</div>
                    </div>
                    <a href="${msg.file.url}" class="download-btn" download="${msg.file.name}">Download</a>
                </div>
            `;
        }

        contentHTML += `<div class="time">${this.formatTime(now)}</div>`;

        item.innerHTML = contentHTML;
        return item;
    }

    appendMessage(msg, isOwnMessage) {
        const messageElement = this.createMessageElement(msg, isOwnMessage);
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = this.input.value.trim();

            if (text || this.fileInput.files.length > 0 || this.imageInput.files.length > 0) {
                const now = new Date();
                const msg = {
                    sender: this.username,
                    text: text,
                    timestamp: now.toISOString()
                };

                if (this.imageInput.files.length > 0) {
                    const file = this.imageInput.files[0];
                    msg.image = await this.handleFileUpload(file, true);
                    this.imageInput.value = '';
                }

                if (this.fileInput.files.length > 0) {
                    const file = this.fileInput.files[0];
                    msg.file = await this.handleFileUpload(file);
                    this.fileInput.value = '';
                }

                this.appendMessage(msg, true);

                // Simulate receiving the message in the other panel
                const otherPanel = this.panel.classList.contains('left-panel')
                    ? rightChatPanel
                    : leftChatPanel;

                setTimeout(() => {
                    otherPanel.appendMessage(msg, false);
                }, 500);

                this.input.value = '';
                this.autoResize();
            }
        });

        this.emojiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.emojiPicker.classList.toggle('show');
        });

        this.fileBtn.addEventListener('click', () => this.fileInput.click());
        this.imageBtn.addEventListener('click', () => this.imageInput.click());

        document.addEventListener('click', (e) => {
            if (!this.emojiPicker.contains(e.target) && e.target !== this.emojiBtn) {
                this.emojiPicker.classList.remove('show');
            }
        });

        this.input.addEventListener('input', () => this.autoResize());
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }
}

// Initialize the chat panels
const leftPanel = document.querySelector('.left-panel');
const rightPanel = document.querySelector('.right-panel');

const leftChatPanel = new ChatPanel(leftPanel, "User 1");
const rightChatPanel = new ChatPanel(rightPanel, "User 2");