/**
 * 社区功能增强模块
 * 实现通知系统、用户活动记录、留言墙增强等功能
 */

// 通知系统实现
const Notifications = {
    // 获取通知列表
    getNotifications() {
        const notifications = localStorage.getItem('notifications');
        return notifications ? JSON.parse(notifications) : [];
    },
    
    // 保存通知列表
    saveNotifications(notifications) {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    },
    
    // 添加新通知
    addNotification(type, title, message, data = {}) {
        const notifications = this.getNotifications();
        const notification = {
            id: Date.now().toString(),
            type,
            title,
            message,
            data,
            read: false,
            timestamp: new Date().toISOString()
        // 不再需要export结尾
// };
        
        notifications.unshift(notification);
        
        // 限制通知数量
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        this.saveNotifications(notifications);
        this.showNotification(title, message, type);
        this.updateNotificationBadge();
        
        return notification;
    },
    
    // 显示通知提示
    showNotification(title, message, type = 'info') {
        // 如果已经有showNotification函数，就使用现有的
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed bottom-20 right-4 md:bottom-4 px-6 py-3 rounded-lg shadow-xl flex items-center z-50 transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
        
        // 设置通知类型样式
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
            notification.innerHTML = `
                <i class="fa fa-check-circle mr-2"></i>
                <div>
                    <div class="font-medium">${title}</div>
                    <div class="text-sm opacity-90">${message}</div>
                </div>
            `;
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
            notification.innerHTML = `
                <i class="fa fa-exclamation-circle mr-2"></i>
                <div>
                    <div class="font-medium">${title}</div>
                    <div class="text-sm opacity-90">${message}</div>
                </div>
            `;
        } else if (type === 'warning') {
            notification.classList.add('bg-yellow-500', 'text-white');
            notification.innerHTML = `
                <i class="fa fa-exclamation-triangle mr-2"></i>
                <div>
                    <div class="font-medium">${title}</div>
                    <div class="text-sm opacity-90">${message}</div>
                </div>
            `;
        } else {
            notification.classList.add('bg-primary', 'text-white');
            notification.innerHTML = `
                <i class="fa fa-info-circle mr-2"></i>
                <div>
                    <div class="font-medium">${title}</div>
                    <div class="text-sm opacity-90">${message}</div>
                </div>
            `;
        }
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ml-4 text-white/70 hover:text-white';
        closeBtn.innerHTML = '<i class="fa fa-times"></i>';
        closeBtn.onclick = () => {
            notification.classList.remove('translate-x-0', 'opacity-100');
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        };
        notification.appendChild(closeBtn);
        
        // 添加到文档
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.remove('translate-x-0', 'opacity-100');
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    },
    
    // 更新通知徽章
    updateNotificationBadge() {
        const notifications = this.getNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // 创建或更新通知徽章
        let badge = document.getElementById('notification-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.id = 'notification-badge';
            badge.className = 'absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full';
        }
        
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        
        // 添加到通知按钮
        const notificationBtn = document.querySelector('[data-tab="notifications"]');
        const mobileNotificationBtn = document.querySelector('a:has(.fa-bell)');
        
        if (unreadCount > 0) {
            // 确保badge在正确的位置
            if (notificationBtn && !notificationBtn.contains(badge)) {
                notificationBtn.classList.add('relative');
                notificationBtn.appendChild(badge);
            }
            
            if (mobileNotificationBtn && !mobileNotificationBtn.contains(badge)) {
                mobileNotificationBtn.classList.add('relative');
                // 克隆一个badge给移动端
                const mobileBadge = badge.cloneNode(true);
                mobileBadge.id = 'mobile-notification-badge';
                mobileNotificationBtn.appendChild(mobileBadge);
            }
        } else {
            // 移除badge
            if (notificationBtn && badge.parentNode === notificationBtn) {
                notificationBtn.removeChild(badge);
                notificationBtn.classList.remove('relative');
            }
            
            const mobileBadge = document.getElementById('mobile-notification-badge');
            if (mobileNotificationBtn && mobileBadge && mobileBadge.parentNode === mobileNotificationBtn) {
                mobileNotificationBtn.removeChild(mobileBadge);
                mobileNotificationBtn.classList.remove('relative');
            }
        }
    },
    
    // 标记所有通知为已读
    markAllAsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        this.saveNotifications(notifications);
        this.updateNotificationBadge();
    },
    
    // 渲染通知列表
    renderNotificationList() {
        const container = document.getElementById('notifications-list');
        if (!container) return;
        
        const notifications = this.getNotifications();
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fa fa-bell-o text-4xl mb-4"></i>
                    <p>暂无通知</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = notifications.map(notification => `
            <div class="p-4 ${notification.read ? 'bg-white' : 'bg-primary/5'} rounded-lg mb-2 hover:bg-gray-50 transition-colors">
                <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                        ${notification.type === 'success' ? 'bg-green-100 text-green-600' :
                         notification.type === 'error' ? 'bg-red-100 text-red-600' :
                         notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                         'bg-primary/20 text-primary'}">
                        <i class="fa fa-${notification.type === 'success' ? 'check' :
                                          notification.type === 'error' ? 'exclamation' :
                                          notification.type === 'warning' ? 'exclamation-triangle' :
                                          'info'}"></i>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-medium text-gray-900">${notification.title}</h4>
                        <p class="text-gray-600 text-sm mt-1">${notification.message}</p>
                        <p class="text-gray-400 text-xs mt-2">${formatDate(notification.timestamp)}</p>
                    </div>
                    ${!notification.read ? `
                        <span class="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2"></span>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },
    
    // 初始化通知系统
    init() {
        this.updateNotificationBadge();
        
        // 监听通知点击
        const notificationBtn = document.querySelector('a:has(.fa-bell)');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderNotificationList();
                this.showNotificationPanel();
            });
        }
    },
    
    // 显示通知面板
    showNotificationPanel() {
        // 创建通知面板
        let panel = document.getElementById('notification-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'notification-panel';
            panel.className = 'fixed top-full right-4 bg-white rounded-xl shadow-2xl w-72 sm:w-80 z-50 transform transition-all duration-300 ease-in-out opacity-0 invisible';
            panel.innerHTML = `
                <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 class="font-semibold text-lg">通知</h3>
                    <button id="mark-all-read-btn" class="text-primary text-sm hover:text-primary/80">全部已读</button>
                </div>
                <div id="notifications-list" class="max-h-[60vh] overflow-y-auto scrollbar-hide">
                    <!-- 通知列表将在这里动态生成 -->
                </div>
                <div class="p-4 border-t border-gray-100 text-center">
                    <button id="close-notification-panel" class="text-gray-500 text-sm hover:text-gray-700">关闭</button>
                </div>
            `;
            document.body.appendChild(panel);
            
            // 监听全部已读按钮
            document.getElementById('mark-all-read-btn').addEventListener('click', () => {
                this.markAllAsRead();
                this.renderNotificationList();
            });
            
            // 监听关闭按钮
            document.getElementById('close-notification-panel').addEventListener('click', () => {
                this.hideNotificationPanel();
            });
            
            // 点击外部关闭面板
            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && !e.target.closest('a:has(.fa-bell)')) {
                    this.hideNotificationPanel();
                }
            });
        }
        
        // 显示面板
        panel.classList.remove('opacity-0', 'invisible');
        panel.style.top = 'calc(100% + 8px)';
    },
    
    // 隐藏通知面板
    hideNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel) {
            panel.classList.add('opacity-0', 'invisible');
        }
    }
};

// 用户活动记录系统
const UserActivity = {
    // 获取用户活动记录
    getActivities() {
        const activities = localStorage.getItem('userActivities');
        return activities ? JSON.parse(activities) : [];
    },
    
    // 保存用户活动记录
    saveActivities(activities) {
        localStorage.setItem('userActivities', JSON.stringify(activities));
    },
    
    // 添加活动记录
    addActivity(type, description, data = {}) {
        const activities = this.getActivities();
        const activity = {
            id: Date.now().toString(),
            type,
            description,
            data,
            timestamp: new Date().toISOString()
        };
        
        activities.unshift(activity);
        
        // 限制活动记录数量
        if (activities.length > 100) {
            activities.splice(100);
        }
        
        this.saveActivities(activities);
        return activity;
    },
    
    // 渲染活动记录
    renderActivities() {
        const container = document.getElementById('user-activities');
        if (!container) return;
        
        const activities = this.getActivities();
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fa fa-history text-4xl mb-4"></i>
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = activities.map(activity => `
            <div class="flex items-start mb-6 relative">
                <div class="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-100 -z-10"></div>
                <div class="w-7 h-7 rounded-full flex items-center justify-center mr-4 flex-shrink-0
                    ${activity.type === 'post' ? 'bg-primary/20 text-primary' :
                     activity.type === 'comment' ? 'bg-secondary/20 text-secondary' :
                     activity.type === 'like' ? 'bg-red-100 text-red-500' :
                     activity.type === 'map' ? 'bg-green-100 text-green-500' :
                     'bg-blue-100 text-blue-500'}">
                    <i class="fa fa-${activity.type === 'post' ? 'comment' :
                                       activity.type === 'comment' ? 'comment-o' :
                                       activity.type === 'like' ? 'heart' :
                                       activity.type === 'map' ? 'map-marker' :
                                       'clock-o'}"></i>
                </div>
                <div class="flex-1">
                    <p class="text-gray-700">${activity.description}</p>
                    <p class="text-gray-400 text-xs mt-1">${formatDate(activity.timestamp)}</p>
                </div>
            </div>
        `).join('');
    },
    
    // 获取用户统计信息
    getUserStats() {
        const activities = this.getActivities();
        
        return {
            totalPosts: activities.filter(a => a.type === 'post').length,
            totalComments: activities.filter(a => a.type === 'comment').length,
            totalLikes: activities.filter(a => a.type === 'like').length,
            totalMarkers: activities.filter(a => a.type === 'map').length,
            joinDate: activities.length > 0 ? new Date(activities[activities.length - 1].timestamp) : new Date()
        };
    },
    
    // 渲染用户统计
    renderUserStats() {
        const container = document.getElementById('user-stats');
        if (!container) return;
        
        const stats = this.getUserStats();
        
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <i class="fa fa-comments text-primary text-xl mb-2"></i>
                    <p class="text-2xl font-bold text-gray-800">${stats.totalPosts}</p>
                    <p class="text-gray-500 text-sm">发布留言</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <i class="fa fa-comment-o text-secondary text-xl mb-2"></i>
                    <p class="text-2xl font-bold text-gray-800">${stats.totalComments}</p>
                    <p class="text-gray-500 text-sm">评论数</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <i class="fa fa-heart text-red-500 text-xl mb-2"></i>
                    <p class="text-2xl font-bold text-gray-800">${stats.totalLikes}</p>
                    <p class="text-gray-500 text-sm">获得点赞</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 text-center">
                    <i class="fa fa-map-marker text-green-500 text-xl mb-2"></i>
                    <p class="text-2xl font-bold text-gray-800">${stats.totalMarkers}</p>
                    <p class="text-gray-500 text-sm">地图标记</p>
                </div>
            </div>
            <div class="mt-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
                <p class="text-gray-700 text-sm">
                    <i class="fa fa-calendar-check-o text-primary mr-2"></i>
                    加入社区时间: ${stats.joinDate.toLocaleDateString('zh-CN')}
                </p>
                <p class="text-gray-700 text-sm mt-2">
                    <i class="fa fa-star text-yellow-500 mr-2"></i>
                    社区等级: ${this.calculateUserLevel(stats)}
                </p>
            </div>
        `;
    },
    
    // 计算用户等级
    calculateUserLevel(stats) {
        const totalScore = stats.totalPosts * 10 + stats.totalComments * 5 + stats.totalLikes + stats.totalMarkers * 15;
        
        if (totalScore >= 1000) return '资深粉丝';
        if (totalScore >= 500) return '核心粉丝';
        if (totalScore >= 200) return '活跃粉丝';
        if (totalScore >= 50) return '普通粉丝';
        return '新粉丝';
    },
    
    // 初始化用户活动系统
    init() {
        this.renderActivities();
        this.renderUserStats();
    }
};

// 留言墙增强功能
const MessageWallEnhancements = {
    // 表情反应数据
    getMessageReactions(messageId) {
        const reactions = localStorage.getItem('messageReactions');
        const allReactions = reactions ? JSON.parse(reactions) : {};
        return allReactions[messageId] || {
            heart: 0,
            thumbsUp: 0,
            smile: 0,
            celebrate: 0,
            users: {}
        };
    },
    
    // 保存表情反应
    saveMessageReactions(messageId, reactions) {
        const allReactions = localStorage.getItem('messageReactions') ? JSON.parse(localStorage.getItem('messageReactions')) : {};
        allReactions[messageId] = reactions;
        localStorage.setItem('messageReactions', JSON.stringify(allReactions));
    },
    
    // 添加表情反应
    addReaction(messageId, reactionType) {
        const reactions = this.getMessageReactions(messageId);
        const userId = currentUser.username;
        
        // 如果用户已经有反应，移除它
        if (reactions.users[userId]) {
            if (reactions.users[userId] === reactionType) {
                // 如果是相同的反应，取消反应
                reactions[reactionType]--;
                delete reactions.users[userId];
                this.saveMessageReactions(messageId, reactions);
                return reactions;
            } else {
                // 如果是不同的反应，先移除旧的，再添加新的
                const oldReaction = reactions.users[userId];
                reactions[oldReaction]--;
            }
        }
        
        // 添加新反应
        reactions[reactionType]++;
        reactions.users[userId] = reactionType;
        this.saveMessageReactions(messageId, reactions);
        
        return reactions;
    },
    
    // 渲染表情反应
    renderReactions(messageId, container) {
        const reactions = this.getMessageReactions(messageId);
        const userId = currentUser.username;
        
        const reactionTypes = [
            { type: 'heart', icon: 'fa-heart', color: 'text-red-500', label: '喜欢' },
            { type: 'thumbsUp', icon: 'fa-thumbs-up', color: 'text-blue-500', label: '赞同' },
            { type: 'smile', icon: 'fa-smile-o', color: 'text-yellow-500', label: '开心' },
            { type: 'celebrate', icon: 'fa-trophy', color: 'text-green-500', label: '庆祝' }
        ];
        
        container.innerHTML = `
            <div class="flex items-center space-x-3">
                ${reactionTypes.map(reaction => `
                    <button class="flex items-center space-x-1 text-sm ${reactions.users[userId] === reaction.type ? reaction.color : 'text-gray-500'} hover:${reaction.color} transition-colors px-2 py-1 rounded-full" data-reaction="${reaction.type}">
                        <i class="fa ${reaction.icon}"></i>
                        <span>${reactions[reaction.type] || 0}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        // 添加点击事件
        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const reactionType = btn.dataset.reaction;
                this.addReaction(messageId, reactionType);
                this.renderReactions(messageId, container);
            });
        });
    },
    
    // 标签数据
    getMessageTags() {
        const tags = localStorage.getItem('messageTags');
        return tags ? JSON.parse(tags) : {
            popular: ['#BoomRaveewit', '#粉丝活动', '#新作品', '#演唱会', '#日常分享'],
            userDefined: []
        };
    },
    
    // 保存标签
    saveMessageTags(tags) {
        localStorage.setItem('messageTags', JSON.stringify(tags));
    },
    
    // 添加自定义标签
    addCustomTag(tag) {
        const tags = this.getMessageTags();
        const normalizedTag = tag.startsWith('#') ? tag : '#' + tag;
        
        if (!tags.userDefined.includes(normalizedTag) && !tags.popular.includes(normalizedTag)) {
            tags.userDefined.push(normalizedTag);
            this.saveMessageTags(tags);
        }
        
        return normalizedTag;
    },
    
    // 渲染标签选择器
    renderTagSelector(container) {
        const tags = this.getMessageTags();
        
        container.innerHTML = `
            <div class="flex flex-wrap gap-2 mb-4">
                ${[...tags.popular, ...tags.userDefined].map(tag => `
                    <button class="px-3 py-1 bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary rounded-full text-sm transition-colors tag-selector-btn" data-tag="${tag}">
                        ${tag}
                    </button>
                `).join('')}
                <button id="add-custom-tag-btn" class="px-3 py-1 bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary rounded-full text-sm transition-colors flex items-center gap-1">
                    <i class="fa fa-plus"></i>
                    <span>添加标签</span>
                </button>
            </div>
            <input type="text" id="custom-tag-input" class="hidden w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="输入新标签...">
        `;
        
        // 添加标签点击事件
        container.querySelectorAll('.tag-selector-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tag = btn.dataset.tag;
                const messageInput = document.getElementById('message-input');
                
                if (messageInput.value.includes(tag)) {
                    // 如果已包含，则移除
                    messageInput.value = messageInput.value.replace(tag, '').trim();
                    btn.classList.remove('bg-primary/10', 'text-primary');
                    btn.classList.add('bg-gray-100', 'text-gray-700');
                } else {
                    // 如果不包含，则添加
                    messageInput.value += (messageInput.value ? ' ' : '') + tag;
                    btn.classList.remove('bg-gray-100', 'text-gray-700');
                    btn.classList.add('bg-primary/10', 'text-primary');
                }
                
                messageInput.focus();
            });
        });
        
        // 添加自定义标签按钮事件
        const addCustomBtn = document.getElementById('add-custom-tag-btn');
        const customTagInput = document.getElementById('custom-tag-input');
        
        addCustomBtn.addEventListener('click', () => {
            customTagInput.classList.remove('hidden');
            customTagInput.focus();
        });
        
        customTagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && customTagInput.value.trim()) {
                const newTag = this.addCustomTag(customTagInput.value.trim());
                this.renderTagSelector(container);
                customTagInput.classList.add('hidden');
                customTagInput.value = '';
                
                // 自动添加新标签到输入框
                const messageInput = document.getElementById('message-input');
                messageInput.value += (messageInput.value ? ' ' : '') + newTag;
            }
        });
    },
    
    // 过滤带有特定标签的留言
    filterMessagesByTag(tag) {
        const messages = getMessages();
        return messages.filter(message => 
            message.content.includes(tag)
        );
    },
    
    // 初始化留言墙增强功能
    init() {
        // 渲染标签选择器
        const tagContainer = document.createElement('div');
        tagContainer.id = 'tag-selector-container';
        
        const messageForm = document.querySelector('#messages-content .card');
        if (messageForm) {
            const textarea = messageForm.querySelector('textarea');
            if (textarea) {
                const parent = textarea.parentNode;
                parent.insertBefore(tagContainer, textarea.nextSibling);
                this.renderTagSelector(tagContainer);
            }
        }
        
        // 监听标签点击（在留言列表中）
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('message-tag')) {
                const tag = e.target.textContent;
                const filteredMessages = this.filterMessagesByTag(tag);
                renderFilteredMessages(filteredMessages, tag);
            }
        });
    }
};

// 扩展留言渲染函数
function renderFilteredMessages(messages, filterTag = '') {
    const container = document.getElementById('messages-list');
    if (!container) return;
    
    // 显示过滤标题
    let filterHeader = document.getElementById('filter-header');
    if (!filterHeader) {
        filterHeader = document.createElement('div');
        filterHeader.id = 'filter-header';
        filterHeader.className = 'bg-primary/5 rounded-xl p-4 mb-6 flex justify-between items-center';
        container.parentNode.insertBefore(filterHeader, container);
    }
    
    filterHeader.innerHTML = `
        <div class="flex items-center">
            <i class="fa fa-filter text-primary mr-2"></i>
            <span class="text-primary font-medium">正在查看标签: ${filterTag}</span>
        </div>
        <button id="clear-filter-btn" class="text-gray-600 hover:text-gray-800">
            <i class="fa fa-times"></i>
        </button>
    `;
    
    // 清除过滤
    document.getElementById('clear-filter-btn').addEventListener('click', () => {
        filterHeader.remove();
        renderMessages();
    });
    
    // 渲染过滤后的留言
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 bg-gray-50 rounded-2xl">
                <i class="fa fa-inbox text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">没有找到带有该标签的留言</p>
            </div>
        `;
        return;
    }
    
    renderMessages(messages);
}

// 初始化所有功能
function initCommunityFeatures() {
    // 确保currentUser存在
    if (!window.currentUser) {
        const savedUser = localStorage.getItem('currentUser');
        window.currentUser = savedUser ? JSON.parse(savedUser) : { username: 'Guest' };
    }
    
    // 初始化各个模块
    Notifications.init();
    UserActivity.init();
    MessageWallEnhancements.init();
    
    // 增强留言渲染功能
    const originalRenderMessages = window.renderMessages;
    window.renderMessages = function(messages) {
        const result = originalRenderMessages.call(this, messages);
        
        // 为每条留言添加表情反应功能
        document.querySelectorAll('.message-card').forEach(card => {
            const messageId = card.dataset.messageId;
            if (messageId) {
                // 查找反应容器或创建
                let reactionContainer = card.querySelector('.message-reactions');
                if (!reactionContainer) {
                    // 查找操作栏或创建
                    let actionBar = card.querySelector('.message-actions');
                    if (!actionBar) {
                        actionBar = document.createElement('div');
                        actionBar.className = 'message-actions flex justify-between items-center mt-4 pt-4 border-t border-gray-100';
                        
                        // 将表情反应添加到操作栏
                        reactionContainer = document.createElement('div');
                        reactionContainer.className = 'message-reactions';
                        actionBar.appendChild(reactionContainer);
                        
                        // 添加到卡片底部
                        const cardContent = card.querySelector('.flex-1');
                        if (cardContent) {
                            cardContent.appendChild(actionBar);
                        }
                    } else {
                        reactionContainer = document.createElement('div');
                        reactionContainer.className = 'message-reactions';
                        actionBar.appendChild(reactionContainer);
                    }
                }
                
                // 渲染表情反应
                MessageWallEnhancements.renderReactions(messageId, reactionContainer);
            }
        });
        
        // 解析标签
        document.querySelectorAll('.message-content').forEach(content => {
            const text = content.textContent;
            const taggedText = text.replace(/#[\u4e00-\u9fa5\w]+/g, match => 
                `<span class="message-tag text-primary cursor-pointer hover:underline">${match}</span>`
            );
            if (taggedText !== text) {
                content.innerHTML = taggedText;
            }
        });
        
        return result;
    };
    
    // 增强发布留言功能
    const postMessageBtn = document.getElementById('post-message-btn');
    if (postMessageBtn) {
        const originalClickHandler = postMessageBtn.onclick;
        postMessageBtn.onclick = function() {
            const result = originalClickHandler && originalClickHandler.apply(this, arguments);
            
            // 添加活动记录
            const messageInput = document.getElementById('message-input');
            if (messageInput.value.trim()) {
                UserActivity.addActivity('post', '发布了一条留言', {
                    content: messageInput.value.trim()
                });
                
                // 更新用户活动UI
                UserActivity.renderActivities();
                UserActivity.renderUserStats();
                
                // 触发随机通知（用于演示）
                if (Math.random() > 0.7) {
                    Notifications.addNotification('info', '社区动态', '有新粉丝加入了社区！');
                }
            }
            
            return result;
        };
    }
    
    // 增强添加地图标记功能
    const submitMarkerBtn = document.getElementById('submit-marker-btn');
    if (submitMarkerBtn) {
        const originalClickHandler = submitMarkerBtn.onclick;
        submitMarkerBtn.onclick = function() {
            const result = originalClickHandler && originalClickHandler.apply(this, arguments);
            
            // 添加活动记录
            const city = document.getElementById('marker-city').value.trim();
            if (city) {
                UserActivity.addActivity('map', `在${city}添加了地图标记`, {
                    city: city
                });
                
                // 更新用户活动UI
                UserActivity.renderActivities();
                UserActivity.renderUserStats();
            }
            
            return result;
        };
    }
    
    // 为页面添加用户中心和通知选项卡
    addUserCenterAndNotificationsTabs();
    
    console.log('社区功能增强模块初始化完成');
}

// 添加用户中心和通知选项卡
function addUserCenterAndNotificationsTabs() {
    // 桌面端侧边栏
    const sidebarNav = document.querySelector('.aside .card');
    if (sidebarNav) {
        // 通知选项卡
        const notificationsTab = document.createElement('button');
        notificationsTab.id = 'sidebar-notifications-tab';
        notificationsTab.className = 'w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium';
        notificationsTab.innerHTML = `
            <i class="fa fa-bell mr-3 w-5 text-center"></i>
            <span>通知中心</span>
        `;
        
        // 用户中心选项卡
        const userCenterTab = document.createElement('button');
        userCenterTab.id = 'sidebar-user-tab';
        userCenterTab.className = 'w-full flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium';
        userCenterTab.innerHTML = `
            <i class="fa fa-user mr-3 w-5 text-center"></i>
            <span>个人中心</span>
        `;
        
        // 添加到侧边栏导航
        sidebarNav.querySelector('.space-y-1').appendChild(notificationsTab);
        sidebarNav.querySelector('.space-y-1').appendChild(userCenterTab);
        
        // 添加点击事件
        notificationsTab.addEventListener('click', () => {
            showContent('notifications');
            updateActiveTab('sidebar-notifications-tab');
        });
        
        userCenterTab.addEventListener('click', () => {
            showContent('user-center');
            updateActiveTab('sidebar-user-tab');
        });
    }
    
    // 移动端底部导航已经有通知和用户中心图标，只需要添加点击事件
    const mobileNavItems = document.querySelectorAll('.lg\:hidden nav a');
    mobileNavItems.forEach(item => {
        if (item.querySelector('.fa-bell')) {
            item.setAttribute('data-tab', 'notifications');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showContent('notifications');
            });
        } else if (item.querySelector('.fa-user')) {
            item.setAttribute('data-tab', 'user-center');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showContent('user-center');
            });
        }
    });
    
    // 创建通知内容区域
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
        // 通知内容
        const notificationsContent = document.createElement('div');
        notificationsContent.id = 'notifications-content';
        notificationsContent.className = 'hidden space-y-6 animate-fade-in';
        notificationsContent.innerHTML = `
            <div class="bg-white rounded-2xl shadow-md p-6 card">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <i class="fa fa-bell text-primary mr-3"></i>
                    通知中心
                </h2>
                <div id="notifications-list" class="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                    <!-- 通知列表将在这里动态生成 -->
                </div>
            </div>
        `;
        
        // 用户中心内容
        const userCenterContent = document.createElement('div');
        userCenterContent.id = 'user-center-content';
        userCenterContent.className = 'hidden space-y-6 animate-fade-in';
        userCenterContent.innerHTML = `
            <div class="bg-white rounded-2xl shadow-md p-6 card">
                <h2 class="text-2xl font-bold mb-6 flex items-center">
                    <i class="fa fa-user text-primary mr-3"></i>
                    个人中心
                </h2>
                
                <!-- 用户统计 -->
                <div id="user-stats" class="mb-8">
                    <!-- 用户统计将在这里动态生成 -->
                </div>
                
                <!-- 最近活动 -->
                <h3 class="text-xl font-semibold mb-4">最近活动</h3>
                <div id="user-activities" class="max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                    <!-- 活动记录将在这里动态生成 -->
                </div>
            </div>
        `;
        
        // 添加到主内容区域
        mainContent.appendChild(notificationsContent);
        mainContent.appendChild(userCenterContent);
    }
}

// 显示特定内容区域
function showContent(contentType) {
    // 隐藏所有内容区域
    document.getElementById('messages-content')?.classList.add('hidden');
    document.getElementById('map-content')?.classList.add('hidden');
    document.getElementById('notifications-content')?.classList.add('hidden');
    document.getElementById('user-center-content')?.classList.add('hidden');
    
    // 显示指定内容区域
    const content = document.getElementById(`${contentType}-content`);
    if (content) {
        content.classList.remove('hidden');
        
        // 根据内容类型执行特定操作
        if (contentType === 'notifications') {
            Notifications.renderNotificationList();
            Notifications.markAllAsRead();
        } else if (contentType === 'user-center') {
            UserActivity.renderActivities();
            UserActivity.renderUserStats();
        } else if (contentType === 'messages') {
            renderMessages();
        }
    }
    
    // 更新移动端标签样式
    const mobileTabs = document.querySelectorAll('[data-tab]');
    mobileTabs.forEach(tab => {
        if (tab.dataset.tab === contentType) {
            tab.classList.add('text-primary');
            tab.classList.remove('text-gray-500');
        } else {
            tab.classList.remove('text-primary');
            tab.classList.add('text-gray-500');
        }
    });
}

// 更新侧边栏活动标签
function updateActiveTab(activeTabId) {
    const sidebarTabs = document.querySelectorAll('.aside .card button');
    sidebarTabs.forEach(tab => {
        if (tab.id === activeTabId) {
            tab.classList.add('text-primary', 'bg-primary/5');
            tab.classList.remove('text-gray-600', 'hover:bg-gray-50');
        } else {
            tab.classList.remove('text-primary', 'bg-primary/5');
            tab.classList.add('text-gray-600', 'hover:bg-gray-50');
        }
    });
}

// 导出功能模块
// 不再导出，改为全局对象
// export { 
    Notifications, 
    UserActivity, 
    MessageWallEnhancements,
    initCommunityFeatures 
// };

// 当文档加载完成后初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // 延迟初始化，确保原始功能已加载
        setTimeout(initCommunityFeatures, 500);
    });
}