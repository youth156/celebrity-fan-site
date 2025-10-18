// utils.js - 通用工具函数模块

/**
 * 多语言翻译数据
 */
export const translations = {
    zh: {
        // 导航
        'nav.home': '首页',
        'nav.community': '社区',
        'nav.profile': '个人中心',
        'nav.login': '登录',
        'nav.logout': '退出登录',
        'nav.language': '语言',
        
        // 留言墙
        'message.wall': '留言墙',
        'message.new': '发布留言',
        'message.content': '留言内容',
        'message.publish': '发布',
        'message.like': '点赞',
        'message.comment': '评论',
        'message.noMessages': '暂无留言',
        'message.loading': '加载中...',
        'message.edited': '已编辑',
        
        // 排序和过滤
        'sort.latest': '最新',
        'sort.popular': '热门',
        'sort.mostComments': '评论最多',
        'search.placeholder': '搜索留言或用户...',
        
        // 评论
        'comment.placeholder': '写下你的评论...',
        'comment.send': '发送',
        'comment.noComments': '暂无评论',
        
        // 地图
        'map.title': '星光地图',
        'map.addMarker': '添加标记',
        'map.markers': '标记',
        'map.region': '地区',
        'map.stats': '统计数据',
        
        // 登录/注册
        'auth.login': '登录',
        'auth.register': '注册',
        'auth.username': '用户名',
        'auth.password': '密码',
        'auth.email': '邮箱',
        'auth.forgotPassword': '忘记密码？',
        'auth.rememberMe': '记住我',
        'auth.agreeTerms': '我同意用户协议',
        'auth.or': '或',
        'auth.thirdPartyLogin': '第三方登录',
        
        // 通知
        'notification.success': '操作成功！',
        'notification.error': '操作失败！',
        'notification.info': '提示信息',
        'notification.welcome': '欢迎回来！',
        
        // 错误信息
        'error.required': '此项为必填',
        'error.invalidEmail': '请输入有效的邮箱地址',
        'error.passwordMismatch': '密码不匹配',
        'error.loginFailed': '登录失败，请检查用户名和密码',
        'error.registerFailed': '注册失败，用户名或邮箱已存在',
        
        // 成功信息
        'success.registered': '注册成功！',
        'success.loggedIn': '登录成功！',
        'success.posted': '发布成功！',
        'success.liked': '点赞成功！',
        'success.commentPosted': '评论成功！',
        
        // 用户中心
        'profile.edit': '编辑资料',
        'profile.messages': '我的留言',
        'profile.comments': '我的评论',
        'profile.likes': '我的点赞',
        
        // 按钮
        'btn.submit': '提交',
        'btn.cancel': '取消',
        'btn.delete': '删除',
        'btn.edit': '编辑',
        'btn.ok': '确定',
        'btn.back': '返回'
    },
    en: {
        // 导航
        'nav.home': 'Home',
        'nav.community': 'Community',
        'nav.profile': 'Profile',
        'nav.login': 'Login',
        'nav.logout': 'Logout',
        'nav.language': 'Language',
        
        // 留言墙
        'message.wall': 'Message Wall',
        'message.new': 'New Message',
        'message.content': 'Message Content',
        'message.publish': 'Publish',
        'message.like': 'Like',
        'message.comment': 'Comment',
        'message.noMessages': 'No messages yet',
        'message.loading': 'Loading...',
        'message.edited': 'Edited',
        
        // 排序和过滤
        'sort.latest': 'Latest',
        'sort.popular': 'Popular',
        'sort.mostComments': 'Most Comments',
        'search.placeholder': 'Search messages or users...',
        
        // 评论
        'comment.placeholder': 'Write your comment...',
        'comment.send': 'Send',
        'comment.noComments': 'No comments yet',
        
        // 地图
        'map.title': 'Star Map',
        'map.addMarker': 'Add Marker',
        'map.markers': 'Markers',
        'map.region': 'Region',
        'map.stats': 'Statistics',
        
        // 登录/注册
        'auth.login': 'Login',
        'auth.register': 'Register',
        'auth.username': 'Username',
        'auth.password': 'Password',
        'auth.email': 'Email',
        'auth.forgotPassword': 'Forgot Password?',
        'auth.rememberMe': 'Remember Me',
        'auth.agreeTerms': 'I agree to the terms',
        'auth.or': 'or',
        'auth.thirdPartyLogin': 'Third-party Login',
        
        // 通知
        'notification.success': 'Success!',
        'notification.error': 'Error!',
        'notification.info': 'Information',
        'notification.welcome': 'Welcome back!',
        
        // 错误信息
        'error.required': 'This field is required',
        'error.invalidEmail': 'Please enter a valid email',
        'error.passwordMismatch': 'Passwords do not match',
        'error.loginFailed': 'Login failed, check username and password',
        'error.registerFailed': 'Registration failed, username or email exists',
        
        // 成功信息
        'success.registered': 'Registered successfully!',
        'success.loggedIn': 'Logged in successfully!',
        'success.posted': 'Posted successfully!',
        'success.liked': 'Liked successfully!',
        'success.commentPosted': 'Comment posted successfully!',
        
        // 用户中心
        'profile.edit': 'Edit Profile',
        'profile.messages': 'My Messages',
        'profile.comments': 'My Comments',
        'profile.likes': 'My Likes',
        
        // 按钮
        'btn.submit': 'Submit',
        'btn.cancel': 'Cancel',
        'btn.delete': 'Delete',
        'btn.edit': 'Edit',
        'btn.ok': 'OK',
        'btn.back': 'Back'
    },
    th: {
        // 导航
        'nav.home': 'หน้าหลัก',
        'nav.community': 'ชุมชน',
        'nav.profile': 'โปรไฟล์',
        'nav.login': 'เข้าสู่ระบบ',
        'nav.logout': 'ออกจากระบบ',
        'nav.language': 'ภาษา',
        
        // 留言墙
        'message.wall': 'กำแพงข้อความ',
        'message.new': 'ข้อความใหม่',
        'message.content': 'เนื้อหาข้อความ',
        'message.publish': 'เผยแพร่',
        'message.like': 'ถูกใจ',
        'message.comment': 'แสดงความคิดเห็น',
        'message.noMessages': 'ยังไม่มีข้อความ',
        'message.loading': 'กำลังโหลด...',
        'message.edited': 'แก้ไขแล้ว',
        
        // 排序和过滤
        'sort.latest': 'ล่าสุด',
        'sort.popular': '人気',
        'sort.mostComments': 'ความคิดเห็นมากที่สุด',
        'search.placeholder': 'ค้นหาข้อความหรือผู้ใช้...',
        
        // 评论
        'comment.placeholder': 'เขียนความคิดเห็นของคุณ...',
        'comment.send': 'ส่ง',
        'comment.noComments': 'ยังไม่มีความคิดเห็น',
        
        // 地图
        'map.title': 'แผนที่ดาว',
        'map.addMarker': 'เพิ่มเครื่องหมาย',
        'map.markers': 'เครื่องหมาย',
        'map.region': 'ภูมิภาค',
        'map.stats': 'สถิติ',
        
        // 登录/注册
        'auth.login': 'เข้าสู่ระบบ',
        'auth.register': 'ลงทะเบียน',
        'auth.username': 'ชื่อผู้ใช้',
        'auth.password': 'รหัสผ่าน',
        'auth.email': 'อีเมล',
        'auth.forgotPassword': 'ลืมรหัสผ่าน?',
        'auth.rememberMe': 'จดจำฉัน',
        'auth.agreeTerms': 'ฉันยอมรับข้อกำหนด',
        'auth.or': 'หรือ',
        'auth.thirdPartyLogin': 'เข้าสู่ระบบทางบุคคลที่สาม',
        
        // 通知
        'notification.success': 'สำเร็จ!',
        'notification.error': 'เกิดข้อผิดพลาด!',
        'notification.info': 'ข้อมูล',
        'notification.welcome': 'ยินดีต้อนรับกลับ!',
        
        // 错误信息
        'error.required': 'ฟิลด์นี้เป็น强制性',
        'error.invalidEmail': 'โปรดป้อนอีเมลที่ถูกต้อง',
        'error.passwordMismatch': 'รหัสผ่านไม่ตรงกัน',
        'error.loginFailed': 'เข้าสู่ระบบล้มเหลวตรวจสอบชื่อผู้ใช้และรหัสผ่าน',
        'error.registerFailed': 'ลงทะเบียนล้มเหลวชื่อผู้ใช้หรืออีเมลมีอยู่แล้ว',
        
        // 成功信息
        'success.registered': 'ลงทะเบียนสำเร็จ!',
        'success.loggedIn': 'เข้าสู่ระบบสำเร็จ!',
        'success.posted': 'โพสต์สำเร็จ!',
        'success.liked': 'ถูกใจสำเร็จ!',
        'success.commentPosted': 'โพสต์ความคิดเห็นสำเร็จ!',
        
        // 用户中心
        'profile.edit': 'แก้ไขโปรไฟล์',
        'profile.messages': 'ข้อความของฉัน',
        'profile.comments': 'ความคิดเห็นของฉัน',
        'profile.likes': 'ถูกใจของฉัน',
        
        // 按钮
        'btn.submit': 'ส่ง',
        'btn.cancel': 'ยกเลิก',
        'btn.delete': 'ลบ',
        'btn.edit': 'แก้ไข',
        'btn.ok': 'ตกลง',
        'btn.back': 'กลับ'
    }
};

/**
 * 获取翻译文本
 * @param {string} key 翻译键名
 * @param {string} lang 语言代码
 * @returns {string} 翻译后的文本
 */
export function translate(key, lang = 'zh') {
    return translations[lang]?.[key] || key;
}

/**
 * 更新页面上的所有翻译元素
 * @param {string} lang 语言代码
 */
export function updateTranslations(lang = 'zh') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translate(key, lang);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = translate(key, lang);
    });
}

/**
 * 显示通知
 * @param {string} message 通知消息
 * @param {string} type 通知类型 (success, error, info)
 * @param {number} duration 持续时间(毫秒)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform translate-x-full opacity-0`;
    
    // 设置通知样式
    switch(type) {
        case 'success':
            notification.classList.add('bg-green-50', 'text-green-800', 'border-l-4', 'border-green-500');
            break;
        case 'error':
            notification.classList.add('bg-red-50', 'text-red-800', 'border-l-4', 'border-red-500');
            break;
        case 'info':
        default:
            notification.classList.add('bg-blue-50', 'text-blue-800', 'border-l-4', 'border-blue-500');
    }
    
    // 设置通知内容
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="mr-4">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    ${type === 'success' ? 
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' : 
                        type === 'error' ? 
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' : 
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
                    }
                </svg>
            </div>
            <div>
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * 格式化日期
 * @param {string|Date} date 日期对象或ISO字符串
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * 验证邮箱格式
 * @param {string} email 邮箱地址
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * 获取URL参数
 * @param {string} name 参数名
 * @returns {string|null} 参数值
 */
export function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * 滚动到顶部
 */
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 截断文本
 * @param {string} text 原文本
 * @param {number} maxLength 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}