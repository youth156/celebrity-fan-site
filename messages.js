// messages.js - 留言墙功能模块

// 存储键名常量
const messagesKey = 'fanMessages';
const commentsKey = 'messageComments';

// 当前排序方式
let currentSort = 'latest';
let currentSearch = '';

/**
 * 获取保存的留言数据
 * @returns {Array} 留言数组
 */
function getMessages() {
    const messages = localStorage.getItem(messagesKey);
    return messages ? JSON.parse(messages) : [];
}

/**
 * 保存留言数据
 * @param {Array} messages 留言数组
 */
function saveMessages(messages) {
    localStorage.setItem(messagesKey, JSON.stringify(messages));
    // 重新渲染消息列表
    if (typeof renderMessages === 'function') {
        renderMessages();
    }
}

/**
 * 获取保存的评论数据
 * @returns {Object} 评论对象，键为留言ID，值为评论数组
 */
function getComments() {
    const comments = localStorage.getItem(commentsKey);
    return comments ? JSON.parse(comments) : {};
}

/**
 * 获取特定留言的评论
 * @param {string} messageId 留言ID
 * @returns {Array} 评论数组
 */
function getCommentsForMessage(messageId) {
    const comments = getComments();
    return comments[messageId] || [];
}

/**
 * 保存评论数据
 * @param {Object} comments 评论对象
 */
function saveComments(comments) {
    localStorage.setItem(commentsKey, JSON.stringify(comments));
}

/**
 * 排序消息
 * @param {Array} messages 消息数组
 * @returns {Array} 排序后的消息数组
 */
function sortMessages(messages) {
    const sortedMessages = [...messages];
    
    switch(currentSort) {
        case 'popular':
            return sortedMessages.sort((a, b) => {
                const likesA = a.likes || 0;
                const likesB = b.likes || 0;
                return likesB - likesA;
            });
        case 'mostComments':
            return sortedMessages.sort((a, b) => {
                const commentsA = getCommentsForMessage(a.id).length;
                const commentsB = getCommentsForMessage(b.id).length;
                return commentsB - commentsA;
            });
        case 'latest':
        default:
            return sortedMessages.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
    }
}

/**
 * 过滤消息
 * @param {Array} messages 消息数组
 * @returns {Array} 过滤后的消息数组
 */
function filterMessages(messages) {
    if (!currentSearch) return messages;
    
    const searchTerm = currentSearch.toLowerCase();
    return messages.filter(message => {
        return message.content.toLowerCase().includes(searchTerm) ||
               message.username.toLowerCase().includes(searchTerm);
    });
}

/**
 * 设置排序方式
 * @param {string} sortType 排序类型 (latest, popular, mostComments)
 */
function setSort(sortType) {
    currentSort = sortType;
    
    // 更新排序按钮样式
    document.querySelectorAll('[data-sort]').forEach(btn => {
        if (btn.dataset.sort === sortType) {
            btn.classList.add('text-primary', 'bg-primary/5');
            btn.classList.remove('text-gray-600', 'hover:text-primary', 'hover:bg-primary/5');
        } else {
            btn.classList.remove('text-primary', 'bg-primary/5');
            btn.classList.add('text-gray-600', 'hover:text-primary', 'hover:bg-primary/5');
        }
    });
    
    // 重新渲染消息
    if (typeof renderMessages === 'function') {
        renderMessages();
    }
}

/**
 * 设置搜索关键词
 * @param {string} searchTerm 搜索关键词
 */
function setSearch(searchTerm) {
    currentSearch = searchTerm;
    if (typeof renderMessages === 'function') {
        renderMessages();
    }
}

/**
 * 发布新留言
 * @param {string} username 用户名
 * @param {string} content 留言内容
 * @param {Array} images 图片数组
 * @returns {Object} 新发布的留言对象
 */
function postMessage(username, content, images = []) {
    const messages = getMessages();
    
    const newMessage = {
        id: Date.now().toString(),
        username: username,
        content: content,
        images: images,
        likes: [],
        timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    saveMessages(messages);
    
    return newMessage;
}

/**
 * 发布评论
 * @param {string} messageId 留言ID
 * @param {string} username 用户名
 * @param {string} content 评论内容
 * @returns {Object} 新发布的评论对象
 */
function postComment(messageId, username, content) {
    const comments = getComments();
    
    if (!comments[messageId]) {
        comments[messageId] = [];
    }
    
    const newComment = {
        id: Date.now().toString(),
        username: username,
        content: content,
        timestamp: new Date().toISOString()
    };
    
    comments[messageId].push(newComment);
    saveComments(comments);
    
    return newComment;
}

/**
 * 切换点赞状态
 * @param {string} messageId 留言ID
 * @param {string} username 用户名
 * @returns {boolean} 是否点赞成功
 */
function toggleLike(messageId, username) {
    const messages = getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (!message) return false;
    
    if (!message.likes) {
        message.likes = [];
    }
    
    const likeIndex = message.likes.indexOf(username);
    if (likeIndex > -1) {
        // 取消点赞
        message.likes.splice(likeIndex, 1);
    } else {
        // 添加点赞
        message.likes.push(username);
    }
    
    saveMessages(messages);
    return true;
}

/**
 * 删除留言
 * @param {string} messageId 留言ID
 * @param {string} username 用户名
 * @returns {boolean} 是否删除成功
 */
function deleteMessage(messageId, username) {
    const messages = getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex === -1) return false;
    
    // 检查是否为留言作者
    if (messages[messageIndex].username !== username) return false;
    
    // 删除留言
    messages.splice(messageIndex, 1);
    saveMessages(messages);
    
    // 同时删除相关评论
    const comments = getComments();
    if (comments[messageId]) {
        delete comments[messageId];
        saveComments(comments);
    }
    
    return true;
}

/**
 * 删除评论
 * @param {string} messageId 留言ID
 * @param {string} commentId 评论ID
 * @param {string} username 用户名
 * @returns {boolean} 是否删除成功
 */
function deleteComment(messageId, commentId, username) {
    const comments = getComments();
    
    if (!comments[messageId]) return false;
    
    const commentIndex = comments[messageId].findIndex(c => c.id === commentId);
    if (commentIndex === -1) return false;
    
    // 检查是否为评论作者
    if (comments[messageId][commentIndex].username !== username) return false;
    
    // 删除评论
    comments[messageId].splice(commentIndex, 1);
    saveComments(comments);
    
    return true;
}

/**
 * 编辑留言
 * @param {string} messageId 留言ID
 * @param {string} username 用户名
 * @param {string} newContent 新内容
 * @returns {boolean} 是否编辑成功
 */
function editMessage(messageId, username, newContent) {
    const messages = getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (!message || message.username !== username) return false;
    
    message.content = newContent;
    message.edited = true;
    message.editTimestamp = new Date().toISOString();
    
    saveMessages(messages);
    return true;
}