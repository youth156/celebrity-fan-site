/**
 * 社区功能增强模块
 * 实现通知系统、用户活动记录等功能
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
        };
        
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
    
    // 初始化通知系统
    init() {
        this.updateNotificationBadge();
        
        // 添加通知按钮点击事件
        const notificationBtn = document.querySelector('[data-tab="notifications"]');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }
    }
};

// 用户活动记录系统实现
const UserActivity = {
    // 获取活动记录
    getActivities() {
        const activities = localStorage.getItem('userActivities');
        return activities ? JSON.parse(activities) : [];
    },
    
    // 保存活动记录
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
    
    // 渲染活动列表
    renderActivities() {
        const container = document.getElementById('user-activities');
        if (!container) return;
        
        const activities = this.getActivities();
        
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fa fa-history text-3xl mb-2"></i>
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        // 渲染活动记录
        container.innerHTML = activities.map(activity => `
            <div class="p-3 border-b border-gray-100 last:border-0">
                <div class="flex items-start">
                    <div class="bg-primary/10 text-primary p-2 rounded-full mr-3">
                        ${this.getTypeIcon(activity.type)}
                    </div>
                    <div class="flex-1">
                        <p class="text-gray-800">${activity.description}</p>
                        <p class="text-xs text-gray-500 mt-1">${this.formatTime(activity.timestamp)}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // 渲染用户统计信息
    renderUserStats() {
        const container = document.getElementById('user-stats');
        if (!container) return;
        
        const activities = this.getActivities();
        
        // 计算统计数据
        const stats = {
            totalActivities: activities.length,
            messageActivities: activities.filter(a => a.type === 'message').length,
            commentActivities: activities.filter(a => a.type === 'comment').length
        };
        
        container.innerHTML = `
            <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-primary/5 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-primary">${stats.totalActivities}</div>
                    <div class="text-sm text-gray-600">总活动</div>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-500">${stats.messageActivities}</div>
                    <div class="text-sm text-gray-600">发布留言</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-500">${stats.commentActivities}</div>
                    <div class="text-sm text-gray-600">发表评论</div>
                </div>
            </div>
        `;
    },
    
    // 获取活动类型图标
    getTypeIcon(type) {
        const icons = {
            message: '<i class="fa fa-comment"></i>',
            comment: '<i class="fa fa-commenting"></i>',
            like: '<i class="fa fa-heart"></i>',
            map: '<i class="fa fa-map-marker"></i>',
            login: '<i class="fa fa-sign-in"></i>',
            logout: '<i class="fa fa-sign-out"></i>'
        };
        return icons[type] || '<i class="fa fa-circle"></i>';
    },
    
    // 格式化时间
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return '刚刚';
        if (diffMins < 60) return `${diffMins}分钟前`;
        if (diffHours < 24) return `${diffHours}小时前`;
        if (diffDays < 30) return `${diffDays}天前`;
        
        return date.toLocaleDateString();
    },
    
    // 初始化用户活动系统
    init() {
        // 可以在这里添加一些初始化逻辑
    }
};

// 留言墙增强功能
const MessageWallEnhancements = {
    // 初始化留言墙增强功能
    init() {
        // 可以在这里添加一些初始化逻辑
    }
};

// 初始化社区功能
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
    
    // 添加一些默认活动记录（如果是新用户）
    const activities = UserActivity.getActivities();
    if (activities.length === 0) {
        UserActivity.addActivity('login', `${window.currentUser.username} 加入了粉丝社区`);
    }
    
    // 创建用户中心和通知选项卡内容
    createUserTabs();
}

// 创建用户中心和通知选项卡内容
function createUserTabs() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // 创建通知内容区域
    const notificationsContent = document.createElement('div');
    notificationsContent.id = 'notifications-content';
    notificationsContent.className = 'hidden';
    notificationsContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">通知中心</h2>
                <button id="mark-all-read" class="text-primary hover:text-primary/80 text-sm font-medium">
                    全部标为已读
                </button>
            </div>
            
            <div id="notifications-list" class="max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                <!-- 通知列表将在这里动态生成 -->
            </div>
        </div>
    `;
    
    // 创建用户中心内容区域
    const userCenterContent = document.createElement('div');
    userCenterContent.id = 'user-center-content';
    userCenterContent.className = 'hidden';
    userCenterContent.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">用户中心</h2>
            
            <!-- 用户信息卡片 -->
            <div class="bg-gradient-to-r from-primary/5 to-purple-50 p-6 rounded-xl mb-6">
                <div class="flex items-center">
                    <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl mr-4">
                        <i class="fa fa-user"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${window.currentUser.username || 'Guest'}</h3>
                        <p class="text-gray-600">粉丝社区成员</p>
                    </div>
                </div>
            </div>
            
            <!-- 用户统计 -->
            <div id="user-stats">
                <!-- 统计信息将在这里动态生成 -->
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
    
    // 添加标记所有通知为已读按钮事件
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            Notifications.markAllAsRead();
            Notifications.renderNotificationList();
        });
    }
}

// 显示特定内容区域
function showContent(contentType) {
    // 隐藏所有内容区域
    document.getElementById('messages-content')?.classList.add('hidden');
    // 地图功能已移至独立页面
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
            if (typeof window.renderMessages === 'function') {
                window.renderMessages();
            }
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

// 当文档加载完成后初始化
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // 延迟初始化，确保原始功能已加载
        setTimeout(initCommunityFeatures, 500);
    });
}