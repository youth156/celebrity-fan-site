// auth.js - 认证相关功能模块

/**
 * 获取当前登录用户信息
 * @returns {Object|null} 用户信息对象或null（未登录）
 */
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        console.error('解析用户数据失败:', e);
        return null;
    }
}

/**
 * 保存用户登录状态
 * @param {Object} userData 用户数据
 * @param {boolean} rememberMe 是否记住登录状态
 */
function saveUser(userData, rememberMe = false) {
    const userString = JSON.stringify(userData);
    
    if (rememberMe) {
        localStorage.setItem('user', userString);
    } else {
        sessionStorage.setItem('user', userString);
    }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * 退出登录
 */
function logout() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
}

/**
 * 验证登录状态，如果未登录则跳转到登录页
 * @param {string} redirectUrl 登录成功后重定向的URL
 * @returns {boolean} 是否已登录
 */
function checkLoginStatus(redirectUrl = window.location.pathname) {
    const user = getCurrentUser();
    
    if (!user) {
        // 用户未登录，重定向到登录页
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        return false;
    }
    
    return true;
}

/**
 * 获取用户列表（模拟数据）
 * @returns {Array} 用户数组
 */
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [
        // 默认示例用户
        { username: 'demo', password: 'demo123', email: 'demo@example.com' }
    ];
}

/**
 * 保存用户列表
 * @param {Array} users 用户数组
 */
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

/**
 * 注册新用户
 * @param {string} username 用户名
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {Object|null} 注册成功返回用户对象，失败返回null
 */
function register(username, email, password) {
    const users = getUsers();
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
        return null;
    }
    
    // 检查邮箱是否已存在
    if (users.some(u => u.email === email)) {
        return null;
    }
    
    // 创建新用户
    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
}

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Object|null} 登录成功返回用户对象，失败返回null
 */
function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 返回安全的用户数据（不包含密码）
        return { username: user.username, email: user.email };
    }
    
    return null;
}

/**
 * 获取用户语言偏好设置
 * @returns {string} 语言代码
 */
function getPreferredLanguage() {
    return localStorage.getItem('preferredLanguage') || 'zh';
}

/**
 * 保存用户语言偏好设置
 * @param {string} lang 语言代码
 */
function savePreferredLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
}