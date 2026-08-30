// 聊天记录生成器 Pro - 完整功能
let messages = [];
let messageId = 0;
let currentTheme = 'wechat';

// 主题配置
const themes = {
    wechat: {
        bg: '#ededed',
        myBubble: '#95ec69',
        otherBubble: '#ffffff',
        headerBg: '#ededed',
        inputBg: '#f7f7f7'
    },
    qq: {
        bg: '#f5f6fa',
        myBubble: '#00a6ff',
        otherBubble: '#ffffff',
        headerBg: '#12b7f5',
        inputBg: '#f5f6fa'
    },
    dingtalk: {
        bg: '#f5f5f5',
        myBubble: '#1890ff',
        otherBubble: '#ffffff',
        headerBg: '#1890ff',
        inputBg: '#f5f5f5'
    },
    whatsapp: {
        bg: '#e5ddd5',
        myBubble: '#dcf8c6',
        otherBubble: '#ffffff',
        headerBg: '#075e54',
        inputBg: '#f0f0f0'
    },
    telegram: {
        bg: '#0e1621',
        myBubble: '#2b5278',
        otherBubble: '#182533',
        headerBg: '#17212b',
        inputBg: '#17212b'
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setCurrentTime();
    renderChat();
    renderMessageList();
    updateStatusBar();
    
    // 监听标题输入
    document.getElementById('chatTitleInput').addEventListener('input', function() {
        document.getElementById('chatTitle').textContent = this.value || '微信聊天';
    });
    
    // 回车快捷添加
    document.getElementById('messageInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addMessage();
        }
    });
    
    // 头像预览
    document.getElementById('avatarInput').addEventListener('input', function() {
        updateAvatarPreview(this.value);
    });
    
    // 监听发送者切换
    document.querySelectorAll('input[name="sender"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateDefaultAvatar();
        });
    });
    
    // 监听消息类型切换
    document.getElementById('messageType').addEventListener('change', function() {
        toggleMessageInputs(this.value);
    });
    
    // 每分钟更新状态栏时间
    setInterval(updateStatusBar, 30000);
});

// 更新状态栏时间
function updateStatusBar() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.querySelector('.status-bar .time').textContent = `${hours}:${minutes}`;
}

// 切换标签页
function switchTab(tabName) {
    // 更新标签按钮
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const tabMap = {
        'basic': 'basicTab',
        'advanced': 'advancedTab',
        'themes': 'themesTab'
    };
    
    document.getElementById(tabMap[tabName]).classList.add('active');
}

// 切换消息输入框
function toggleMessageInputs(type) {
    const groups = {
        text: 'textInputGroup',
        image: 'imageInputGroup',
        file: 'fileInputGroup',
        transfer: 'transferInputGroup',
        location: 'locationInputGroup'
    };
    
    // 隐藏所有特殊输入组
    Object.values(groups).forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    // 显示对应的输入组
    if (groups[type]) {
        document.getElementById(groups[type]).style.display = 'block';
    }
    
    // 文本和语音消息共用文本输入
    if (type === 'text' || type === 'voice' || type === 'video' || type === 'redpacket' || type === 'contact') {
        document.getElementById('textInputGroup').style.display = 'block';
    }
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// 设置当前时间
function setCurrentTime() {
    document.getElementById('timeInput').value = getCurrentTime();
}

// 更新头像预览
function updateAvatarPreview(value) {
    const preview = document.getElementById('avatarPreview');
    if (value) {
        if (value.startsWith('http')) {
            preview.innerHTML = `<img src="${value}" alt="avatar">`;
        } else {
            preview.textContent = value;
        }
    }
}

// 更新默认头像
function updateDefaultAvatar() {
    const sender = document.querySelector('input[name="sender"]:checked').value;
    const avatarInput = document.getElementById('avatarInput');
    if (!avatarInput.value || avatarInput.value === '😊' || avatarInput.value === '👤') {
        avatarInput.value = sender === 'me' ? '😊' : '👤';
        updateAvatarPreview(avatarInput.value);
    }
}

// 添加消息
function addMessage() {
    const sender = document.querySelector('input[name="sender"]:checked').value;
    const avatar = document.getElementById('avatarInput').value || (sender === 'me' ? '😊' : '👤');
    const name = document.getElementById('nameInput').value || (sender === 'me' ? '我' : '对方');
    const type = document.getElementById('messageType').value;
    const time = document.getElementById('timeInput').value || getCurrentTime();
    const status = document.getElementById('messageStatus').value;
    
    let content = '';
    let messageData = {};
    
    switch(type) {
        case 'text':
        case 'voice':
        case 'video':
        case 'redpacket':
            content = document.getElementById('messageInput').value.trim();
            if (!content) {
                alert('请输入消息内容');
                return;
            }
            messageData = { text: content };
            break;
        case 'image':
            content = document.getElementById('imageUrlInput').value.trim();
            if (!content) {
                alert('请输入图片URL');
                return;
            }
            messageData = { imageUrl: content };
            break;
        case 'file':
            const fileName = document.getElementById('fileNameInput').value.trim();
            const fileSize = document.getElementById('fileSizeInput').value.trim();
            if (!fileName) {
                alert('请输入文件名');
                return;
            }
            content = fileName;
            messageData = { fileName: fileName, fileSize: fileSize || '未知大小' };
            break;
        case 'transfer':
            const amount = document.getElementById('transferAmountInput').value;
            const note = document.getElementById('transferNoteInput').value.trim();
            if (!amount) {
                alert('请输入转账金额');
                return;
            }
            content = `转账¥${amount}`;
            messageData = { amount: amount, note: note || '转账' };
            break;
        case 'location':
            const locationName = document.getElementById('locationNameInput').value.trim();
            const locationAddress = document.getElementById('locationAddressInput').value.trim();
            if (!locationName) {
                alert('请输入位置名称');
                return;
            }
            content = locationName;
            messageData = { name: locationName, address: locationAddress };
            break;
        case 'contact':
            content = document.getElementById('messageInput').value.trim();
            if (!content) {
                alert('请输入联系人名称');
                return;
            }
            messageData = { name: content, phone: '13800138000' };
            break;
    }
    
    const message = {
        id: messageId++,
        sender: sender,
        avatar: avatar,
        name: name,
        content: content,
        type: type,
        time: time,
        status: status,
        data: messageData
    };
    
    messages.push(message);
    renderChat();
    renderMessageList();
    
    // 清空输入
    document.getElementById('messageInput').value = '';
    document.getElementById('imageUrlInput').value = '';
    document.getElementById('fileNameInput').value = '';
    document.getElementById('fileSizeInput').value = '';
    document.getElementById('transferAmountInput').value = '';
    document.getElementById('transferNoteInput').value = '';
    document.getElementById('locationNameInput').value = '';
    document.getElementById('locationAddressInput').value = '';
    
    setCurrentTime();
    
    // 滚动到底部
    const chatArea = document.getElementById('chatArea');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
    
    // 聚焦输入框
    document.getElementById('messageInput').focus();
}

// 渲染聊天记录
function renderChat() {
    const chatArea = document.getElementById('chatArea');
    const chatTitle = document.getElementById('chatTitle');
    chatTitle.textContent = document.getElementById('chatTitleInput').value || '微信聊天';
    
    if (messages.length === 0) {
        chatArea.innerHTML = `
            <div style="text-align:center;padding-top:100px;color:#999;">
                <div style="font-size:48px;margin-bottom:20px;">💬</div>
                <p>暂无消息，请在右侧添加</p>
            </div>
        `;
        return;
    }
    
    chatArea.innerHTML = '';
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        if (msg.avatar.startsWith('http')) {
            avatarDiv.innerHTML = `<img src="${msg.avatar}" alt="avatar" onerror="this.style.display='none';this.parentElement.textContent='👤';">`;
        } else {
            avatarDiv.textContent = msg.avatar;
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const bubble = createBubble(msg);
        contentDiv.appendChild(bubble);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = `${msg.name} ${msg.time}`;
        contentDiv.appendChild(timeDiv);
        
        if (msg.sender === 'me') {
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(avatarDiv);
        } else {
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
        }
        
        chatArea.appendChild(messageDiv);
    });
}

// 创建气泡
function createBubble(msg) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    switch(msg.type) {
        case 'text':
            bubble.textContent = msg.content;
            break;
        case 'image':
            bubble.innerHTML = `<div class="message-image"><img src="${msg.data.imageUrl}" alt="图片" onerror="this.alt='图片加载失败'"></div>`;
            break;
        case 'voice':
            bubble.innerHTML = `
                <div class="message-voice">
                    <span class="voice-icon">🎤</span>
                    <span class="voice-duration">${Math.floor(Math.random() * 30 + 5)}''</span>
                </div>
            `;
            break;
        case 'video':
            bubble.innerHTML = `
                <div class="message-image">
                    <div style="position:relative;">
                        <div style="width:200px;height:150px;background:#333;border-radius:5px;display:flex;align-items:center;justify-content:center;color:white;font-size:40px;">▶️</div>
                    </div>
                </div>
            `;
            break;
        case 'file':
            bubble.innerHTML = `
                <div class="message-file">
                    <span class="file-icon">📄</span>
                    <div class="file-info">
                        <div class="file-name">${msg.data.fileName}</div>
                        <div class="file-size">${msg.data.fileSize}</div>
                    </div>
                </div>
            `;
            break;
        case 'transfer':
            bubble.innerHTML = `
                <div class="message-transfer">
                    <div>转账</div>
                    <div class="transfer-amount">¥${msg.data.amount}</div>
                    <div class="transfer-note">${msg.data.note}</div>
                </div>
            `;
            break;
        case 'redpacket':
            bubble.innerHTML = `
                <div class="message-redpacket">
                    <div class="redpacket-text">恭喜发财，大吉大利</div>
                    <div style="font-size:12px;margin-top:5px;">${msg.content || '红包'}</div>
                </div>
            `;
            break;
        case 'location':
            bubble.innerHTML = `
                <div class="message-location">
                    <div class="location-name">📍 ${msg.data.name}</div>
                    <div class="location-address">${msg.data.address || '位置信息'}</div>
                </div>
            `;
            break;
        case 'contact':
            bubble.innerHTML = `
                <div class="message-contact">
                    <div class="contact-avatar">${msg.data.name.charAt(0)}</div>
                    <div class="contact-info">
                        <div class="contact-name">${msg.data.name}</div>
                        <div class="contact-phone">微信号：${msg.data.phone}</div>
                    </div>
                </div>
            `;
            break;
    }
    
    // 添加状态标识
    if (msg.sender === 'me' && msg.status !== 'sent') {
        const statusSpan = document.createElement('span');
        statusSpan.className = `message-status status-${msg.status}`;
        statusSpan.textContent = msg.status === 'read' ? '已读' : msg.status === 'delivered' ? '已送达' : '发送失败';
        bubble.appendChild(statusSpan);
    }
    
    return bubble;
}

// 渲染消息列表
function renderMessageList() {
    const messageList = document.getElementById('messageList');
    
    if (messages.length === 0) {
        messageList.innerHTML = '<h3>消息列表</h3><p style="color:#999;text-align:center;padding:20px;">暂无消息</p>';
        return;
    }
    
    const listHtml = messages.map(msg => `
        <div class="message-item" onclick="editMessage(${msg.id})">
            <span style="flex:1;">
                ${msg.avatar.startsWith('http') ? '🖼️' : msg.avatar} 
                ${msg.name}: ${msg.content.substring(0, 30)}${msg.content.length > 30 ? '...' : ''}
            </span>
            <span class="delete-btn" onclick="event.stopPropagation();deleteMessage(${msg.id})" title="删除">×</span>
        </div>
    `).join('');
    
    messageList.innerHTML = `<h3>消息列表 (${messages.length})</h3>` + listHtml;
}

// 编辑消息
function editMessage(id) {
    const msg = messages.find(m => m.id === id);
    if (!msg) return;
    
    // 填充表单
    document.querySelector(`input[name="sender"][value="${msg.sender}"]`).checked = true;
    document.getElementById('avatarInput').value = msg.avatar;
    document.getElementById('nameInput').value = msg.name;
    document.getElementById('messageInput').value = msg.content;
    document.getElementById('timeInput').value = msg.time;
    document.getElementById('messageType').value = msg.type;
    document.getElementById('messageStatus').value = msg.status;
    
    // 删除原消息
    messages = messages.filter(m => m.id !== id);
    renderChat();
    renderMessageList();
    
    // 切换到基础标签
    switchTab('basic');
    
    alert('已加载消息到编辑区，修改后点击"添加消息"重新添加');
}

// 删除消息
function deleteMessage(id) {
    if (confirm('确定要删除这条消息吗？')) {
        messages = messages.filter(msg => msg.id !== id);
        renderChat();
        renderMessageList();
    }
}

// 清空所有消息
function clearAll() {
    if (messages.length === 0) {
        alert('暂无消息可清空');
        return;
    }
    
    if (confirm('确定要清空所有消息吗？此操作不可撤销！')) {
        messages = [];
        renderChat();
        renderMessageList();
    }
}

// 导出截图
async function exportChat() {
    if (messages.length === 0) {
        alert('请先添加消息再导出');
        return;
    }
    
    const phoneFrame = document.getElementById('phoneFrame');
    
    const loadingToast = document.createElement('div');
    loadingToast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 16px;
        z-index: 9999;
    `;
    loadingToast.textContent = '正在生成截图...';
    document.body.appendChild(loadingToast);
    
    try {
        const canvas = await html2canvas(phoneFrame, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true
        });
        
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `聊天记录_${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        loadingToast.textContent = '✅ 导出成功！';
        loadingToast.style.background = 'rgba(7, 193, 96, 0.9)';
    } catch (err) {
        console.error('导出失败:', err);
        loadingToast.textContent = '❌ 导出失败，请重试';
        loadingToast.style.background = 'rgba(245, 108, 108, 0.9)';
    }
    
    setTimeout(() => {
        document.body.removeChild(loadingToast);
    }, 2000);
}

// 快速添加消息
function quickAdd(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('quickInput');
        const content = input.value.trim();
        if (content) {
            document.getElementById('messageInput').value = content;
            document.getElementById('senderSelect').value = 'me';
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

// 批量导入
function batchImport() {
    const batchText = document.getElementById('batchInput').value.trim();
    if (!batchText) {
        alert('请输入要导入的对话');
        return;
    }
    
    const lines = batchText.split('\n');
    let successCount = 0;
    
    lines.forEach(line => {
        const parts = line.split('|');
        if (parts.length >= 2) {
            const sender = parts[0].trim() === '我' ? 'me' : 'other';
            const content = parts[1].trim();
            const time = parts[2] ? parts[2].trim() : getCurrentTime();
            
            if (content) {
                const message = {
                    id: messageId++,
                    sender: sender,
                    avatar: sender === 'me' ? '😊' : '👤',
                    name: sender === 'me' ? '我' : '对方',
                    content: content,
                    type: 'text',
                    time: time,
                    status: 'sent',
                    data: { text: content }
                };
                messages.push(message);
                successCount++;
            }
        }
    });
    
    renderChat();
    renderMessageList();
    
    if (successCount > 0) {
        alert(`成功导入 ${successCount} 条消息`);
        document.getElementById('batchInput').value = '';
    }
}

// 自动生成对话
function generateConversation(type) {
    const templates = {
        greeting: [
            { sender: 'other', content: '早上好！', time: '08:00' },
            { sender: 'me', content: '早上好！今天天气不错', time: '08:01' },
            { sender: 'other', content: '是啊，适合出去玩', time: '08:02' },
            { sender: 'me', content: '要不要一起去公园？', time: '08:03' },
            { sender: 'other', content: '好啊，什么时候？', time: '08:04' },
            { sender: 'me', content: '十点怎么样？', time: '08:05' }
        ],
        business: [
            { sender: 'other', content: '王总，项目进展如何？', time: '14:00' },
            { sender: 'me', content: '李总，目前进展顺利', time: '14:05' },
            { sender: 'other', content: '好的，下周三能交付吗？', time: '14:06' },
            { sender: 'me', content: '没问题，保证按时交付', time: '14:07' },
            { sender: 'other', content: '辛苦你了', time: '14:08' }
        ],
        casual: [
            { sender: 'me', content: '在干嘛呢？', time: '20:00' },
            { sender: 'other', content: '在看电影，你呢？', time: '20:01' },
            { sender: 'me', content: '我在打游戏', time: '20:02' },
            { sender: 'other', content: '什么游戏？', time: '20:03' },
            { sender: 'me', content: '王者荣耀，一起吗？', time: '20:04' },
            { sender: 'other', content: '好啊，等我一下', time: '20:05' }
        ]
    };
    
    if (messages.length > 0) {
        if (!confirm('生成对话将添加到现有消息，继续吗？')) {
            return;
        }
    }
    
    const template = templates[type] || templates.greeting;
    
    template.forEach(item => {
        const message = {
            id: messageId++,
            sender: item.sender,
            avatar: item.sender === 'me' ? '😊' : '👤',
            name: item.sender === 'me' ? '我' : '对方',
            content: item.content,
            type: 'text',
            time: item.time,
            status: 'read',
            data: { text: item.content }
        };
        messages.push(message);
    });
    
    renderChat();
    renderMessageList();
    
    const chatArea = document.getElementById('chatArea');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

// 保存到本地
function saveToLocal() {
    try {
        const data = {
            messages: messages,
            title: document.getElementById('chatTitleInput').value,
            theme: currentTheme
        };
        localStorage.setItem('chatGeneratorData', JSON.stringify(data));
        alert('✅ 保存成功！');
    } catch (err) {
        alert('❌ 保存失败：' + err.message);
    }
}

// 从本地加载
function loadFromLocal() {
    try {
        const data = localStorage.getItem('chatGeneratorData');
        if (!data) {
            alert('没有找到保存的数据');
            return;
        }
        
        const parsed = JSON.parse(data);
        messages = parsed.messages || [];
        messageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 0;
        
        if (parsed.title) {
            document.getElementById('chatTitleInput').value = parsed.title;
            document.getElementById('chatTitle').textContent = parsed.title;
        }
        
        if (parsed.theme) {
            currentTheme = parsed.theme;
            document.getElementById('themeSelect').value = parsed.theme;
            changeTheme();
        }
        
        renderChat();
        renderMessageList();
        alert('✅ 加载成功！');
    } catch (err) {
        alert('❌ 加载失败：' + err.message);
    }
}

// 导出JSON
function exportJSON() {
    const data = {
        messages: messages,
        title: document.getElementById('chatTitleInput').value,
        theme: currentTheme,
        exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `聊天记录_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// 导入JSON
function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleJSONImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            messages = data.messages || [];
            messageId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 0;
            
            if (data.title) {
                document.getElementById('chatTitleInput').value = data.title;
                document.getElementById('chatTitle').textContent = data.title;
            }
            
            if (data.theme) {
                currentTheme = data.theme;
                document.getElementById('themeSelect').value = data.theme;
                changeTheme();
            }
            
            renderChat();
            renderMessageList();
            alert('✅ 导入成功！');
        } catch (err) {
            alert('❌ 导入失败：无效的JSON文件');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// 按时间排序
function sortByTime() {
    messages.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    renderChat();
    renderMessageList();
    alert('✅ 已按时间排序');
}

// 反转消息顺序
function reverseMessages() {
    messages.reverse();
    renderChat();
    renderMessageList();
    alert('✅ 已反转顺序');
}

// 复制最后一条消息
function duplicateLast() {
    if (messages.length === 0) {
        alert('暂无消息可复制');
        return;
    }
    
    const lastMsg = messages[messages.length - 1];
    const newMsg = { ...lastMsg, id: messageId++ };
    messages.push(newMsg);
    renderChat();
    renderMessageList();
}

// 删除最后一条消息
function deleteLast() {
    if (messages.length === 0) {
        alert('暂无消息可删除');
        return;
    }
    
    messages.pop();
    renderChat();
    renderMessageList();
}

// 全部标记已读
function markAllRead() {
    messages.forEach(msg => {
        if (msg.sender === 'me') {
            msg.status = 'read';
        }
    });
    renderChat();
    renderMessageList();
    alert('✅ 已全部标记为已读');
}

// 加载示例
function loadTemplate() {
    if (messages.length > 0) {
        if (!confirm('加载示例将覆盖当前消息，确定继续吗？')) {
            return;
        }
    }
    
    messages = [
        {
            id: messageId++,
            sender: 'other',
            avatar: '👤',
            name: '张三',
            content: '在吗？',
            type: 'text',
            time: '09:30',
            status: 'read',
            data: { text: '在吗？' }
        },
        {
            id: messageId++,
            sender: 'me',
            avatar: '😊',
            name: '我',
            content: '在的，怎么了？',
            type: 'text',
            time: '09:31',
            status: 'read',
            data: { text: '在的，怎么了？' }
        },
        {
            id: messageId++,
            sender: 'other',
            avatar: '👤',
            name: '张三',
            content: '明天有空吗？一起吃个饭',
            type: 'text',
            time: '09:32',
            status: 'read',
            data: { text: '明天有空吗？一起吃个饭' }
        },
        {
            id: messageId++,
            sender: 'me',
            avatar: '😊',
            name: '我',
            content: '好的，没问题！',
            type: 'text',
            time: '09:33',
            status: 'read',
            data: { text: '好的，没问题！' }
        },
        {
            id: messageId++,
            sender: 'other',
            avatar: '👤',
            name: '张三',
            content: '那明天中午12点老地方见😊',
            type: 'text',
            time: '09:35',
            status: 'read',
            data: { text: '那明天中午12点老地方见😊' }
        },
        {
            id: messageId++,
            sender: 'me',
            avatar: '😊',
            name: '我',
            content: 'OK，不见不散！',
            type: 'text',
            time: '09:36',
            status: 'read',
            data: { text: 'OK，不见不散！' }
        }
    ];
    
    renderChat();
    renderMessageList();
    
    const chatArea = document.getElementById('chatArea');
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

// 显示更多菜单
function showMoreMenu() {
    const menu = document.getElementById('moreMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// 隐藏更多菜单
function hideMoreMenu() {
    document.getElementById('moreMenu').style.display = 'none';
}

// 切换主题
function changeTheme() {
    const themeName = document.getElementById('themeSelect').value;
    currentTheme = themeName;
    
    if (themeName === 'custom') {
        updateCustomTheme();
        return;
    }
    
    const theme = themes[themeName];
    if (!theme) return;
    
    document.querySelector('.chat-area').style.background = theme.bg;
    document.querySelector('.phone-header').style.background = theme.headerBg;
    document.querySelector('.status-bar').style.background = theme.headerBg;
    document.querySelector('.input-bar').style.background = theme.inputBg;
    
    // 更新气泡颜色
    document.querySelectorAll('.sent .bubble').forEach(bubble => {
        bubble.style.background = theme.myBubble;
    });
    
    document.querySelectorAll('.received .bubble').forEach(bubble => {
        bubble.style.background = theme.otherBubble;
    });
}

// 更新自定义主题
function updateCustomTheme() {
    const bgColor = document.getElementById('bgColor').value;
    const myBubbleColor = document.getElementById('myBubbleColor').value;
    const otherBubbleColor = document.getElementById('otherBubbleColor').value;
    
    document.querySelector('.chat-area').style.background = bgColor;
    
    document.querySelectorAll('.sent .bubble').forEach(bubble => {
        bubble.style.background = myBubbleColor;
    });
    
    document.querySelectorAll('.received .bubble').forEach(bubble => {
        bubble.style.background = otherBubbleColor;
    });
    
    if (document.getElementById('themeSelect').value === 'custom') {
        currentTheme = 'custom';
    }
}

// 更新字体大小
function updateFontSize() {
    const fontSize = document.getElementById('fontSize').value;
    document.getElementById('fontSizeValue').textContent = fontSize + 'px';
    document.querySelectorAll('.bubble').forEach(bubble => {
        bubble.style.fontSize = fontSize + 'px';
    });
}

// 切换手机外观
function changePhoneStyle() {
    const style = document.getElementById('phoneStyle').value;
    const phoneFrame = document.getElementById('phoneFrame');
    
    switch(style) {
        case 'modern':
            phoneFrame.style.borderRadius = '40px';
            phoneFrame.style.border = '12px solid #2c2c2c';
            break;
        case 'classic':
            phoneFrame.style.borderRadius = '10px';
            phoneFrame.style.border = '4px solid #999';
            break;
        case 'minimal':
            phoneFrame.style.borderRadius = '0';
            phoneFrame.style.border = '2px solid #333';
            break;
    }
}

// 点击其他地方关闭更多菜单
document.addEventListener('click', function(e) {
    const menu = document.getElementById('moreMenu');
    const moreBtn = document.querySelector('.more-btn');
    
    if (menu.style.display === 'block' && !menu.contains(e.target) && !moreBtn.contains(e.target)) {
        menu.style.display = 'none';
    }
});
