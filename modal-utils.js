// 模态窗工具函数

/**
 * 检查用户登录状态
 * @returns {Object|null} 用户信息对象或null
 */
function checkLoginStatus() {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

/**
 * 显示通知提示
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ease-in-out translate-y-[-20px] opacity-0`;
    
    // 设置不同类型的样式
    if (type === 'success') {
        notification.classList.add('bg-green-500', 'text-white');
        notification.innerHTML = `<i class="fa fa-check-circle mr-2"></i>${message}`;
    } else if (type === 'error') {
        notification.classList.add('bg-red-500', 'text-white');
        notification.innerHTML = `<i class="fa fa-exclamation-circle mr-2"></i>${message}`;
    } else {
        notification.classList.add('bg-blue-500', 'text-white');
        notification.innerHTML = `<i class="fa fa-info-circle mr-2"></i>${message}`;
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.remove('translate-y-[-20px]', 'opacity-0');
    }, 10);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.classList.add('translate-y-[-20px]', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * 显示登录模态窗
 */
function showLoginModal() {
    // 先检查是否已存在模态窗，避免重复创建
    if (document.getElementById('login-modal-container')) {
        return;
    }
    
    // 创建模态窗容器
    const modalContainer = document.createElement('div');
    modalContainer.id = 'login-modal-container';
    modalContainer.className = 'fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop-enter';
    
    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-btn';
    closeButton.className = 'absolute top-4 right-4 text-white/80 hover:text-white text-2xl z-10';
    closeButton.innerHTML = '<i class="fa fa-times"></i>';
    closeButton.onclick = hideLoginModal;
    modalContainer.appendChild(closeButton);
    
    // 创建内容包装器
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden modal-animation-enter';
    
    // 直接在JS中内嵌登录表单HTML
    contentWrapper.innerHTML = `
        <div class="p-6">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">登录/注册</h2>
            
            <!-- 表单标签切换 -->
            <div class="flex mb-6 border-b border-white/20">
                <button id="login-tab" class="flex-1 py-2 text-center text-white font-medium border-b-2 border-primary">登录</button>
                <button id="register-tab" class="flex-1 py-2 text-center text-white/70 hover:text-white font-medium">注册</button>
            </div>
            
            <!-- 登录表单 -->
            <form id="login-form" class="space-y-4">
                <div>
                    <label for="login-username" class="block text-sm font-medium text-white/80 mb-1">用户名</label>
                    <input type="text" id="login-username" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请输入用户名" required>
                </div>
                <div>
                    <label for="login-password" class="block text-sm font-medium text-white/80 mb-1">密码</label>
                    <input type="password" id="login-password" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请输入密码" required>
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input type="checkbox" id="remember-me" class="rounded text-primary focus:ring-primary/50 bg-white/10 border-white/20">
                        <label for="remember-me" class="ml-2 text-sm text-white/70">记住我</label>
                    </div>
                    <a href="#" class="text-sm text-primary hover:text-primary/80">忘记密码?</a>
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">登录</button>
            </form>
            
            <!-- 注册表单 (初始隐藏) -->
            <form id="register-form" class="space-y-4 hidden">
                <div>
                    <label for="register-username" class="block text-sm font-medium text-white/80 mb-1">用户名</label>
                    <input type="text" id="register-username" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请输入用户名" required>
                </div>
                <div>
                    <label for="register-email" class="block text-sm font-medium text-white/80 mb-1">邮箱</label>
                    <input type="email" id="register-email" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请输入邮箱" required>
                </div>
                <div>
                    <label for="register-password" class="block text-sm font-medium text-white/80 mb-1">密码</label>
                    <input type="password" id="register-password" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请输入密码" required>
                </div>
                <div>
                    <label for="register-confirm-password" class="block text-sm font-medium text-white/80 mb-1">确认密码</label>
                    <input type="password" id="register-confirm-password" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white" placeholder="请再次输入密码" required>
                </div>
                <button type="submit" class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">注册</button>
            </form>
            
            <!-- 第三方登录 -->
            <div class="mt-6">
                <div class="flex items-center my-4">
                    <div class="flex-grow h-px bg-white/20"></div>
                    <span class="px-3 text-white/50 text-sm">其他登录方式</span>
                    <div class="flex-grow h-px bg-white/20"></div>
                </div>
                <div class="flex justify-center space-x-4">
                    <button class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <i class="fa fa-weixin text-lg"></i>
                    </button>
                    <button class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <i class="fa fa-qq text-lg"></i>
                    </button>
                    <button class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <i class="fa fa-weibo text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.appendChild(contentWrapper);
    
    // 添加到页面
    document.body.appendChild(modalContainer);
    
    // 添加点击背景关闭模态窗
    modalContainer.addEventListener('click', hideLoginModal);
    
    // 阻止点击模态窗内容时关闭模态窗
    contentWrapper.addEventListener('click', e => e.stopPropagation());
    
    // 设置表单切换功能
    const loginTab = contentWrapper.querySelector('#login-tab');
    const registerTab = contentWrapper.querySelector('#register-tab');
    const loginForm = contentWrapper.querySelector('#login-form');
    const registerForm = contentWrapper.querySelector('#register-form');
    
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('text-white', 'border-primary');
        loginTab.classList.remove('text-white/70', 'border-transparent');
        registerTab.classList.add('text-white/70', 'border-transparent');
        registerTab.classList.remove('text-white', 'border-primary');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('text-white', 'border-primary');
        registerTab.classList.remove('text-white/70', 'border-transparent');
        loginTab.classList.add('text-white/70', 'border-transparent');
        loginTab.classList.remove('text-white', 'border-primary');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // 为登录表单添加提交事件
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            try {
                // 模拟登录成功
                const username = document.getElementById('login-username').value;
                localStorage.setItem('currentUser', JSON.stringify({ username, loggedIn: true }));
                
                // 显示成功提示
                showNotification('登录成功，正在跳转...', 'success');
                console.log('登录成功，用户:', username);
                
                // 直接执行跳转，不依赖延迟
                // 移除模态窗
                document.body.removeChild(modalContainer);
                
                // 立即跳转
                console.log('准备跳转到:', window.location.origin + '/community.html');
                window.location.href = 'community.html';
                
            } catch (error) {
                console.error('登录处理错误:', error);
                showNotification('登录过程中出现错误', 'error');
            }
        });
        
        // 为注册表单添加提交事件
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            try {
                const username = document.getElementById('register-username').value;
                const password = document.getElementById('register-password').value;
                const confirmPassword = document.getElementById('register-confirm-password').value;
                
                if (password !== confirmPassword) {
                    showNotification('两次输入的密码不一致', 'error');
                    return;
                }
                
                // 模拟注册成功
                localStorage.setItem('currentUser', JSON.stringify({ username, loggedIn: true }));
                
                // 显示成功提示
                showNotification('注册成功，正在跳转...', 'success');
                console.log('注册成功，用户:', username);
                
                // 直接执行跳转，不依赖延迟
                // 移除模态窗
                document.body.removeChild(modalContainer);
                
                // 立即跳转
                console.log('准备跳转到:', window.location.origin + '/community.html');
                window.location.href = 'community.html';
                
            } catch (error) {
                console.error('注册处理错误:', error);
                showNotification('注册过程中出现错误', 'error');
            }
        });
    
    // 为模态窗添加特殊标记，表明是从首页打开的
    modalContainer.setAttribute('data-from-index', 'true');
}

/**
 * 隐藏登录模态窗
 */
function hideLoginModal() {
    const modalContainer = document.getElementById('login-modal-container');
    if (modalContainer) {
        // 添加离开动画
        modalContainer.classList.remove('modal-backdrop-enter');
        modalContainer.classList.add('modal-backdrop-leave');
        
        const contentWrapper = modalContainer.querySelector('.modal-animation-enter');
        if (contentWrapper) {
            contentWrapper.classList.remove('modal-animation-enter');
            contentWrapper.classList.add('modal-animation-leave');
        }
        
        // 动画结束后移除
        setTimeout(() => {
            document.body.removeChild(modalContainer);
        }, 300);
    }
}

/**
 * 执行动态加载内容中的脚本
 * @param {HTMLElement} container - 包含脚本的容器
 */
function executeScripts(container) {
    // 提取并执行脚本
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // 复制属性
        Array.from(script.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // 添加脚本内容
        newScript.textContent = script.textContent;
        
        // 替换原始脚本
        script.parentNode.replaceChild(newScript, script);
    });
    
    // 重写登录成功后的跳转逻辑
    const originalLogin = window.performLogin;
    window.performLogin = function(username, password, rememberMe) {
        // 调用原始登录函数
        const result = originalLogin(username, password, rememberMe);
        
        // 如果登录成功，跳转到社区页面
        if (result) {
            setTimeout(() => {
                window.location.href = 'community.html';
            }, 1500);
        }
        
        return result;
    };
}

/**
 * 初始化模态窗功能
 */
function initModal() {
    // 检查是否需要自动显示模态窗（例如从其他页面重定向而来）
    const urlParams = new URLSearchParams(window.location.search);
    const showModal = urlParams.get('showModal') === 'true';
    
    if (showModal && !checkLoginStatus()) {
        // 延迟显示以确保页面加载完成
        setTimeout(showLoginModal, 500);
    }
    
    // 添加ESC键关闭模态窗
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.getElementById('login-modal-container')) {
            hideLoginModal();
        }
    });
}

/**
 * 注册粉丝社区按钮事件监听器
 */
function setupCommunityButtons() {
    // 桌面端按钮
    const desktopButton = document.getElementById('community-btn');
    if (desktopButton) {
        desktopButton.addEventListener('click', function() {
            const user = checkLoginStatus();
            if (user) {
                // 已登录则直接跳转到社区
                window.location.href = 'community.html';
            } else {
                // 未登录则显示登录模态窗
                showLoginModal();
            }
        });
    }
    
    // 移动端按钮
    const mobileButton = document.getElementById('mobile-community-btn');
    if (mobileButton) {
        mobileButton.addEventListener('click', function() {
            // 先关闭移动端菜单
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            const user = checkLoginStatus();
            if (user) {
                // 已登录则直接跳转到社区
                window.location.href = 'community.html';
            } else {
                // 未登录则显示登录模态窗
                showLoginModal();
            }
        });
    }
}

// 导出函数供其他模块使用
window.checkLoginStatus = checkLoginStatus;
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.initModal = initModal;
window.setupCommunityButtons = setupCommunityButtons;

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initModal();
        setupCommunityButtons();
    });
} else {
    initModal();
    setupCommunityButtons();
}