let messages = [];
let messageId = 0;
let uploadedAvatarData = null;
let uploadedMessageImage = null;
let currentTheme = 'wechat';

const themes = {
    wechat: { bg: '#ededed', myBubble: '#95ec69', otherBubble: '#ffffff', headerBg: '#ededed' },
    qq: { bg: '#f5f6fa', myBubble: '#00a6ff', otherBubble: '#ffffff', headerBg: '#12b7f5' },
    dingtalk: { bg: '#f5f5f5', myBubble: '#1890ff', otherBubble: '#ffffff', headerBg: '#1890ff' },
    whatsapp: { bg: '#e5ddd5', myBubble: '#dcf8c6', otherBubble: '#ffffff', headerBg: '#075e54' },
    telegram: { bg: '#0e1621', myBubble: '#2b5278', otherBubble: '#182533', headerBg: '#17212b' }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setCurrentTime();
    renderChat();
    renderMessageList();
    updateStatusBar();
    setInterval(updateStatusBar, 30000);
});

function updateStatusBar() {
    const now = new Date();
    document.querySelector('.status-bar .time').textContent = 
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function getCurrentTime() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function setCurrentTime() {
    document.getElementById('timeInput').value = getCurrentTime();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    const tabMap = { basic: 'basicTab', advanced: 'advancedTab', themes: 'themesTab' };
    document.getElementById(tabMap[tabName]).classList.add('active');
    event.target.classList.add('active');
}

function toggleMessageInputs() {
    const type = document.getElementById('messageType').value;
    const groups = {
        text: 'textInputGroup',
        image: 'imageInputGroup',
        file: 'fileInputGroup',
        transfer: 'transferInputGroup',
        location: 'locationInputGroup'
    };
    
    Object.values(groups).forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    if (groups[type]) {
        document.getElementById(groups[type]).style.display = 'block';
    }
    
    if (['text', 'voice', 'video', 'redpacket', 'contact'].includes(type)) {
        document.getElementById('textInputGroup').style.display = 'block';
    }
}

// 头像上传
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('图片大小不能超过2MB'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedAvatarData = e.target.result;
        document.getElementById('avatarPreview').innerHTML = `<img src="${uploadedAvatarData}" alt="头像">`;
        document.getElementById('avatarInput').value = '';
    };
    reader.readAsDataURL(file);
}

// 消息图片上传
function handleMessageImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('图片大小不能超过5MB'); return; }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedMessageImage = e.target.result;
        document.getElementById('messageImagePreview').src = uploadedMessageImage;
        document.getElementById('messageImagePreview').style.display = 'block';
        document.getElementById('uploadText').style.display = 'none';
        document.getElementById('removeMessageImageBtn').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

function removeMessageImage() {
    uploadedMessageImage = null;
    document.getElementById('messageImagePreview').style.display = 'none';
    document.getElementById('uploadText').style.display = 'block';
    document.getElementById('removeMessageImageBtn').style.display = 'none';
    document.getElementById('messageImageInput').value = '';
}

function addMessage() {
    const sender = document.querySelector('input[name="sender"]:checked').value;
    const name = document.getElementById('nameInput').value || (sender === 'me' ? '我' : '对方');
    const type = document.getElementById('messageType').value;
    const time = document.getElementById('timeInput').value || getCurrentTime();
    const status = document.getElementById('messageStatus').value;
    
    let avatar;
    if (uploadedAvatarData) {
        avatar = uploadedAvatarData;
    } else {
        avatar = document.getElementById('avatarInput').value || (sender === 'me' ? '😊' : '👤');
    }
    
    let content = '';
    let imageData = null;
    
    switch(type) {
        case 'text':
        case 'voice':
        case 'video':
        case 'redpacket':
        case 'contact':
            content = document.getElementById('messageInput').value.trim();
            if (!content) { alert('请输入消息内容'); return; }
            break;
        case 'image':
            if (!uploadedMessageImage) { alert('请先上传图片'); return; }
            content = '[图片]';
            imageData = uploadedMessageImage;
            break;
        case 'file':
            content = document.getElementById('fileNameInput').value.trim();
            if (!content) { alert('请输入文件名'); return; }
            break;
        case 'transfer':
            content = `转账¥${document.getElementById('transferAmountInput').value}`;
            break;
        case 'location':
            content = document.getElementById('locationNameInput').value.trim();
            if (!content) { alert('请输入位置名称'); return; }
            break;
    }
    
    messages.push({ id: messageId++, sender, avatar, name, content, type, time, status, imageData });
    renderChat();
    renderMessageList();
    
    document.getElementById('messageInput').value = '';
    if (type === 'image') removeMessageImage();
    setCurrentTime();
    
    const chatArea = document.getElementById('chatArea');
    chatArea.scrollTop = chatArea.scrollHeight;
}

function renderChat() {
    const chatArea = document.getElementById('chatArea');
    document.getElementById('chatTitle').textContent = document.getElementById('chatTitleInput').value || '微信聊天';
    chatArea.innerHTML = '';
    
    if (messages.length === 0) {
        chatArea.innerHTML = '<div style="text-align:center;padding-top:100px;color:#999;"><div style="font-size:48px;margin-bottom:20px;">💬</div><p>暂无消息</p></div>';
        return;
    }
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        if (msg.avatar.startsWith('http') || msg.avatar.startsWith('data:image')) {
            avatarDiv.innerHTML = `<img src="${msg.avatar}" alt="avatar">`;
        } else {
            avatarDiv.textContent = msg.avatar;
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        if (msg.type === 'image' && msg.imageData) {
            bubble.innerHTML = `<div class="message-image"><img src="${msg.imageData}" alt="图片"></div>`;
        } else {
            bubble.textContent = msg.content;
        }
        
        // 添加红色感叹号（被对方删除）
        if (msg.sender === 'me' && msg.status === 'deleted') {
            const deletedSpan = document.createElement('span');
            deletedSpan.className = 'deleted-icon';
            deletedSpan.textContent = '❗';
            deletedSpan.title = '对方已删除你';
            bubble.appendChild(deletedSpan);
        }
        
        // 添加发送失败标识
        if (msg.sender === 'me' && msg.status === 'failed') {
            const failedSpan = document.createElement('span');
            failedSpan.className = 'deleted-icon';
            failedSpan.textContent = '❌';
            failedSpan.title = '发送失败';
            bubble.appendChild(failedSpan);
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = `${msg.name} ${msg.time}`;
        
        contentDiv.appendChild(bubble);
        contentDiv.appendChild(timeDiv);
        
        if (msg.sender === 'me') {
            msgDiv.appendChild(contentDiv);
            msgDiv.appendChild(avatarDiv);
        } else {
            msgDiv.appendChild(avatarDiv);
            msgDiv.appendChild(contentDiv);
        }
        
        chatArea.appendChild(msgDiv);
    });
}

function renderMessageList() {
    const list = document.getElementById('messageList');
    if (messages.length === 0) {
        list.innerHTML = '<h3>消息列表</h3><p style="color:#999;text-align:center;padding:20px;">暂无消息</p>';
        return;
    }
    
    const html = messages.map(msg => `
        <div class="message-item">
            <span>${msg.name}: ${msg.content.substring(0, 20)}${msg.content.length > 20 ? '...' : ''}</span>
            <span class="delete-btn" onclick="deleteMessage(${msg.id})">×</span>
        </div>
    `).join('');
    list.innerHTML = `<h3>消息列表 (${messages.length})</h3>` + html;
}

function deleteMessage(id) {
    messages = messages.filter(m => m.id !== id);
    renderChat();
    renderMessageList();
}

function clearAll() {
    if (confirm('确定清空所有消息？')) {
        messages = [];
        renderChat();
        renderMessageList();
    }
}

function exportChat() {
    html2canvas(document.getElementById('phoneFrame'), {
        backgroundColor: '#ffffff', scale: 2, useCORS: true
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = '聊天记录.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

function loadTemplate() {
    messages = [
        { id: messageId++, sender: 'other', avatar: '👤', name: '张三', content: '在吗？', type: 'text', time: '09:30', status: 'read', imageData: null },
        { id: messageId++, sender: 'me', avatar: '😊', name: '我', content: '在的，怎么了？', type: 'text', time: '09:31', status: 'read', imageData: null },
        { id: messageId++, sender: 'me', avatar: '😊', name: '我', content: '明天有空吗？', type: 'text', time: '09:32', status: 'deleted', imageData: null },
        { id: messageId++, sender: 'me', avatar: '😊', name: '我', content: '好的，没问题！', type: 'text', time: '09:33', status: 'read', imageData: null }
    ];
    renderChat();
    renderMessageList();
}

function batchImport() {
    const text = document.getElementById('batchInput').value.trim();
    if (!text) { alert('请输入要导入的对话'); return; }
    
    text.split('\n').forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 2) {
            const sender = parts[0].trim() === '我' ? 'me' : 'other';
            const content = parts[1].trim();
            const time = parts[2] ? parts[2].trim() : getCurrentTime();
            if (content) {
                messages.push({
                    id: messageId++, sender,
                    avatar: sender === 'me' ? '😊' : '👤',
                    name: sender === 'me' ? '我' : '对方',
                    content, type: 'text', time, status: 'sent', imageData: null
                });
            }
        }
    });
    renderChat();
    renderMessageList();
    document.getElementById('batchInput').value = '';
    alert('导入成功！');
}

function generateConversation(type) {
    const templates = {
        greeting: [
            { sender: 'other', content: '早上好！', time: '08:00' },
            { sender: 'me', content: '早上好！', time: '08:01' },
            { sender: 'other', content: '今天天气不错', time: '08:02' }
        ],
        business: [
            { sender: 'other', content: '项目进展如何？', time: '14:00' },
            { sender: 'me', content: '进展顺利', time: '14:05' }
        ],
        casual: [
            { sender: 'me', content: '在干嘛呢？', time: '20:00' },
            { sender: 'other', content: '在看电影', time: '20:01' }
        ]
    };
    
    templates[type].forEach(item => {
        messages.push({
            id: messageId++, sender: item.sender,
            avatar: item.sender === 'me' ? '😊' : '👤',
            name: item.sender === 'me' ? '我' : '对方',
            content: item.content, type: 'text', time: item.time, status: 'read', imageData: null
        });
    });
    renderChat();
    renderMessageList();
}

function saveToLocal() {
    localStorage.setItem('chatData', JSON.stringify(messages));
    alert('保存成功！');
}

function loadFromLocal() {
    const data = localStorage.getItem('chatData');
    if (data) {
        messages = JSON.parse(data);
        messageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 0;
        renderChat();
        renderMessageList();
        alert('加载成功！');
    } else {
        alert('没有保存的数据');
    }
}

function exportJSON() {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `聊天记录_${Date.now()}.json`;
    link.click();
}

function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleJSONImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            messages = JSON.parse(e.target.result);
            messageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 0;
            renderChat();
            renderMessageList();
            alert('导入成功！');
        } catch (err) {
            alert('导入失败：无效的JSON文件');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function sortByTime() {
    messages.sort((a, b) => a.time.localeCompare(b.time));
    renderChat();
    renderMessageList();
}

function reverseMessages() {
    messages.reverse();
    renderChat();
    renderMessageList();
}

function duplicateLast() {
    if (messages.length > 0) {
        const last = messages[messages.length - 1];
        messages.push({ ...last, id: messageId++ });
        renderChat();
        renderMessageList();
    }
}

function deleteLast() {
    if (messages.length > 0) {
        messages.pop();
        renderChat();
        renderMessageList();
    }
}

function markAllRead() {
    messages.forEach(msg => { if (msg.sender === 'me') msg.status = 'read'; });
    renderChat();
    renderMessageList();
}

function changeTheme() {
    const themeName = document.getElementById('themeSelect').value;
    if (themeName === 'custom') { updateCustomTheme(); return; }
    
    const theme = themes[themeName];
    if (!theme) return;
    
    document.querySelector('.chat-area').style.background = theme.bg;
    document.querySelector('.phone-header').style.background = theme.headerBg;
    document.querySelector('.status-bar').style.background = theme.headerBg;
    document.querySelectorAll('.sent .bubble').forEach(b => b.style.background = theme.myBubble);
    document.querySelectorAll('.received .bubble').forEach(b => b.style.background = theme.otherBubble);
}

function updateCustomTheme() {
    const bg = document.getElementById('bgColor').value;
    const myBubble = document.getElementById('myBubbleColor').value;
    const otherBubble = document.getElementById('otherBubbleColor').value;
    
    document.querySelector('.chat-area').style.background = bg;
    document.querySelectorAll('.sent .bubble').forEach(b => b.style.background = myBubble);
    document.querySelectorAll('.received .bubble').forEach(b => b.style.background = otherBubble);
}

function updateFontSize() {
    const size = document.getElementById('fontSize').value;
    document.getElementById('fontSizeValue').textContent = size + 'px';
    document.querySelectorAll('.bubble').forEach(b => b.style.fontSize = size + 'px');
}

function changePhoneStyle() {
    const style = document.getElementById('phoneStyle').value;
    const frame = document.getElementById('phoneFrame');
    
    if (style === 'modern') {
        frame.style.borderRadius = '40px';
        frame.style.border = '12px solid #2c2c2c';
    } else if (style === 'classic') {
        frame.style.borderRadius = '10px';
        frame.style.border = '4px solid #999';
    } else {
        frame.style.borderRadius = '0';
        frame.style.border = '2px solid #333';
    }
}

function showMoreMenu() {
    const menu = document.getElementById('moreMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function hideMoreMenu() {
    document.getElementById('moreMenu').style.display = 'none';
}

function quickAdd(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('quickInput');
        const content = input.value.trim();
        if (content) {
            document.getElementById('messageInput').value = content;
            document.querySelector('input[name="sender"][value="me"]').checked = true;
            addMessage();
            input.value = '';
        }
    }
}

function quickAddFromButton() {
    const input = document.getElementById('quickInput');
    const content = input.value.trim();
    if (content) {
        document.getElementById('messageInput').value = content;
        document.querySelector('input[name="sender"][value="me"]').checked = true;
        addMessage();
        input.value = '';
    }
}

// 监听事件
document.getElementById('chatTitleInput').addEventListener('input', function() {
    document.getElementById('chatTitle').textContent = this.value || '微信聊天';
});

document.getElementById('messageInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addMessage();
    }
});
