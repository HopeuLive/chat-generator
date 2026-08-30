* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    max-width: 1200px;
}

/* 手机模拟器 */
.phone-frame {
    width: 375px;
    height: 700px;
    background: #f5f5f5;
    border-radius: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    overflow: hidden;
    position: relative;
    border: 12px solid #2c2c2c;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
}

.status-bar {
    background: #ededed;
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #000;
}

.phone-header {
    background: #ededed;
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #d6d6d6;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.phone-header .title {
    font-size: 17px;
    font-weight: 600;
    color: #000;
    flex: 1;
}

.phone-header .back-btn,
.phone-header .more-btn {
    cursor: pointer;
    font-size: 18px;
    color: #000;
    width: 30px;
}

.chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px 15px;
    background: #ededed;
}

.input-bar {
    display: flex;
    padding: 10px;
    background: #f7f7f7;
    border-top: 1px solid #ddd;
    gap: 10px;
}

.input-bar input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}

.input-bar button {
    padding: 8px 15px;
    background: #07c160;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* 消息样式 */
.message {
    display: flex;
    margin-bottom: 20px;
    animation: fadeIn 0.3s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.message.received {
    justify-content: flex-start;
}

.message.sent {
    justify-content: flex-end;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    margin: 0 10px;
    flex-shrink: 0;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.message-content {
    max-width: 60%;
    position: relative;
}

.bubble {
    padding: 9px 12px;
    border-radius: 5px;
    font-size: 16px;
    line-height: 1.4;
    word-wrap: break-word;
    position: relative;
    display: inline-block;
}

.received .bubble {
    background: white;
    color: #000;
}

.sent .bubble {
    background: #95ec69;
    color: #000;
}

.message-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    text-align: center;
}

/* 图片消息 */
.message-image img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 5px;
    display: block;
}

/* 被删除的红色感叹号 */
.deleted-icon {
    color: #f5222d;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
    cursor: pointer;
    position: relative;
    display: inline-block;
}

.deleted-icon:hover::after {
    content: '对方已删除你';
    position: absolute;
    bottom: -25px;
    right: 0;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 100;
}

/* 控制面板 */
.control-panel {
    width: 450px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    max-height: 700px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.tabs {
    display: flex;
    border-bottom: 2px solid #f0f0f0;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

.tab {
    flex: 1;
    padding: 15px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    transition: all 0.3s;
    position: relative;
}

.tab.active {
    color: #07c160;
}

.tab.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #07c160;
}

.tab-content {
    display: none;
    padding: 20px;
}

.tab-content.active {
    display: block;
}

.tab-content h2 {
    margin-bottom: 20px;
    color: #333;
    font-size: 20px;
}

.form-group {
    margin-bottom: 15px;
    position: relative;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #07c160;
}

.form-group textarea {
    height: 80px;
    resize: vertical;
}

.radio-group {
    display: flex;
    gap: 20px;
}

.radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.radio-label input[type="radio"] {
    margin-right: 5px;
}

/* 头像上传 */
.avatar-input-group {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.avatar-upload-btn {
    padding: 10px 15px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    white-space: nowrap;
}

.avatar-upload-btn:hover {
    background: #e0e0e0;
}

.avatar-preview {
    width: 50px;
    height: 50px;
    border: 2px solid #ddd;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: #f9f9f9;
    overflow: hidden;
    flex-shrink: 0;
}

.avatar-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 上传区域 */
.upload-area {
    border: 2px dashed #ddd;
    border-radius: 5px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: #fafafa;
}

.upload-area:hover {
    border-color: #07c160;
    background: #f0f9f4;
}

.btn-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 100px;
}

.btn-primary {
    background: #07c160;
    color: white;
}

.btn-primary:hover {
    background: #06ad56;
}

.btn-danger {
    background: #f56c6c;
    color: white;
}

.btn-danger:hover {
    background: #f04545;
}

.btn-secondary {
    background: #f0f0f0;
    color: #333;
}

.btn-secondary:hover {
    background: #e0e0e0;
}

.btn-time {
    position: absolute;
    right: 5px;
    top: 30px;
    background: #f0f0f0;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
}

.message-list {
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px;
    background: #fafafa;
}

.message-list h3 {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.message-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
}

.message-item:last-child {
    border-bottom: none;
}

.delete-btn {
    color: #f56c6c;
    cursor: pointer;
    font-size: 18px;
}

.more-menu {
    position: fixed;
    top: 60px;
    right: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    padding: 10px;
    z-index: 1000;
}

.menu-item {
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.2s;
    border-radius: 5px;
}

.menu-item:hover {
    background: #f0f0f0;
}

@media (max-width: 850px) {
    .container {
        flex-direction: column;
        align-items: center;
    }
    
    .control-panel {
        width: 100%;
        max-width: 400px;
    }
}
