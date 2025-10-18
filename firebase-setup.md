# Firebase 集成指南

本指南将帮助您在粉丝社区网站中集成Firebase，实现登录注册、数据库存储等功能。

## 一、Firebase 项目设置

### 1. 创建 Firebase 项目

1. 访问 [Firebase 控制台](https://console.firebase.google.com/)
2. 点击「添加项目」
3. 输入项目名称（如：celebrity-fan-site）
4. 按提示完成项目创建

### 2. 配置 Firebase 服务

#### 启用认证服务
1. 在左侧菜单点击「认证」
2. 点击「开始」
3. 启用所需的登录方式（电子邮件/密码、匿名登录等）

#### 设置 Firestore 数据库
1. 在左侧菜单点击「Firestore 数据库」
2. 点击「创建数据库」
3. 选择「测试模式」开始（生产环境请使用安全规则）
4. 选择适合您的地区

#### 配置存储服务（用于图片上传）
1. 在左侧菜单点击「Storage」
2. 点击「开始使用」
3. 选择适合您的地区
4. 设置存储规则

### 3. 获取 Firebase 配置

1. 在项目概览页面，点击「添加应用」→ 选择「Web」
2. 输入应用昵称
3. 复制提供的配置代码

## 二、项目集成

### 1. 创建 Firebase 配置文件

创建 `firebase-config.js` 文件：

```javascript
// firebase-config.js
// Firebase 配置信息
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
```

### 2. 安装 Firebase SDK

通过 CDN 引入（在 HTML 文件的 `<head>` 中添加）：

```html
<!-- Firebase 核心库 -->
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"></script>
<!-- 认证模块 -->
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-auth-compat.js"></script>
<!-- Firestore 模块 -->
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore-compat.js"></script>
<!-- 存储模块 -->
<script src="https://www.gstatic.com/firebasejs/10.11.0/firebase-storage-compat.js"></script>
```

### 3. 修改认证模块

创建 `firebase-auth.js` 文件，替代之前的本地存储认证：

```javascript
// firebase-auth.js
import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

/**
 * 用户注册
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {Promise} 注册结果
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
}

/**
 * 用户登录
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {Promise} 登录结果
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
}

/**
 * 退出登录
 * @returns {Promise}
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('退出登录失败:', error);
    return false;
  }
}

/**
 * 获取当前用户
 * @returns {Object|null} 当前登录用户或null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * 监听用户登录状态变化
 * @param {Function} callback 状态变化回调函数
 * @returns {Function} 取消监听函数
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 检查登录状态
 * @param {string} redirectUrl 未登录时重定向的URL
 * @returns {boolean} 是否已登录
 */
export function checkAuthStatus(redirectUrl = window.location.pathname) {
  if (!getCurrentUser()) {
    window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    return false;
  }
  return true;
}
```

### 4. 修改留言墙模块

创建 `firebase-messages.js` 文件：

```javascript
// firebase-messages.js
import { db } from './firebase-config.js';
import { collection, addDoc, setDoc, getDoc, getDocs, deleteDoc, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';

// 集合名称
const messagesCollection = 'messages';
const commentsCollection = 'comments';
const usersCollection = 'users';

/**
 * 发布新留言
 * @param {Object} messageData 留言数据
 * @returns {Promise} 发布结果
 */
export async function postMessage(messageData) {
  try {
    const docRef = await addDoc(collection(db, messagesCollection), {
      ...messageData,
      createdAt: new Date(),
      likes: [],
      commentCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('发布留言失败:', error);
    throw error;
  }
}

/**
 * 获取留言列表
 * @param {string} sortBy 排序方式 (latest, popular, mostComments)
 * @returns {Promise} 留言列表
 */
export async function getMessages(sortBy = 'latest') {
  try {
    let q;
    
    switch(sortBy) {
      case 'popular':
        q = query(collection(db, messagesCollection), orderBy('likes', 'desc'));
        break;
      case 'mostComments':
        q = query(collection(db, messagesCollection), orderBy('commentCount', 'desc'));
        break;
      case 'latest':
      default:
        q = query(collection(db, messagesCollection), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('获取留言失败:', error);
    return [];
  }
}

/**
 * 获取特定留言
 * @param {string} messageId 留言ID
 * @returns {Promise} 留言详情
 */
export async function getMessageById(messageId) {
  try {
    const docRef = doc(db, messagesCollection, messageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    return null;
  } catch (error) {
    console.error('获取留言详情失败:', error);
    return null;
  }
}

/**
 * 发布评论
 * @param {string} messageId 留言ID
 * @param {Object} commentData 评论数据
 * @returns {Promise} 评论结果
 */
export async function postComment(messageId, commentData) {
  try {
    // 添加评论
    const commentRef = await addDoc(collection(db, commentsCollection), {
      ...commentData,
      messageId,
      createdAt: new Date()
    });
    
    // 更新留言的评论数
    const messageRef = doc(db, messagesCollection, messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (messageSnap.exists()) {
      const currentCount = messageSnap.data().commentCount || 0;
      await updateDoc(messageRef, {
        commentCount: currentCount + 1
      });
    }
    
    return commentRef.id;
  } catch (error) {
    console.error('发布评论失败:', error);
    throw error;
  }
}

/**
 * 获取特定留言的评论
 * @param {string} messageId 留言ID
 * @returns {Promise} 评论列表
 */
export async function getComments(messageId) {
  try {
    const q = query(
      collection(db, commentsCollection),
      where('messageId', '==', messageId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const comments = [];
    
    querySnapshot.forEach(doc => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('获取评论失败:', error);
    return [];
  }
}

/**
 * 切换点赞状态
 * @param {string} messageId 留言ID
 * @param {string} userId 用户ID
 * @returns {Promise} 点赞结果
 */
export async function toggleLike(messageId, userId) {
  try {
    const messageRef = doc(db, messagesCollection, messageId);
    const messageSnap = await getDoc(messageRef);
    
    if (messageSnap.exists()) {
      const data = messageSnap.data();
      const likes = data.likes || [];
      const likeIndex = likes.indexOf(userId);
      
      if (likeIndex > -1) {
        // 取消点赞
        likes.splice(likeIndex, 1);
      } else {
        // 添加点赞
        likes.push(userId);
      }
      
      await updateDoc(messageRef, { likes });
      return likes;
    }
    
    return [];
  } catch (error) {
    console.error('点赞失败:', error);
    throw error;
  }
}

/**
 * 保存用户信息到数据库
 * @param {string} userId 用户ID
 * @param {Object} userData 用户数据
 * @returns {Promise}
 */
export async function saveUserData(userId, userData) {
  try {
    await setDoc(doc(db, usersCollection, userId), userData, { merge: true });
    return true;
  } catch (error) {
    console.error('保存用户数据失败:', error);
    return false;
  }
}

/**
 * 获取用户信息
 * @param {string} userId 用户ID
 * @returns {Promise} 用户信息
 */
export async function getUserData(userId) {
  try {
    const userRef = doc(db, usersCollection, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return null;
  }
}
```

### 5. 修改登录页面

更新 `login.html` 文件，集成 Firebase 认证：

```html
<!-- 在登录和注册表单提交事件中使用 Firebase 认证 -->
<script>
  import { registerUser, loginUser } from './firebase-auth.js';
  import { saveUserData } from './firebase-messages.js';
  
  // 登录表单处理
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      // 这里需要将用户名转换为邮箱格式，或者在Firebase中使用用户名登录（需要额外设置）
      // 为简化示例，这里假设用户名就是邮箱前缀
      const email = `${username}@example.com`;
      const user = await loginUser(email, password);
      
      // 登录成功，跳转到之前的页面或社区页
      const redirect = new URLSearchParams(window.location.search).get('redirect') || 'community.html';
      window.location.href = redirect;
    } catch (error) {
      showError('loginError', error.message);
    }
  });
  
  // 注册表单处理
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
      const user = await registerUser(email, password);
      
      // 保存用户附加信息
      await saveUserData(user.uid, {
        username,
        email,
        createdAt: new Date(),
        avatar: '',
        bio: ''
      });
      
      // 注册成功，跳转到社区页
      window.location.href = 'community.html';
    } catch (error) {
      showError('registerError', error.message);
    }
  });
</script>
```

### 6. 修改社区页面

更新 `community.html` 文件，使用 Firebase 数据：

```javascript
// 在社区页面初始化时使用 Firebase
import { auth, onAuthChange } from './firebase-auth.js';
import { getMessages, postMessage, postComment, toggleLike, getComments } from './firebase-messages.js';

// 监听登录状态
onAuthChange((user) => {
  if (user) {
    // 用户已登录，显示用户名和退出按钮
    document.getElementById('userName').textContent = user.email.split('@')[0];
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('userMenu').classList.remove('hidden');
  } else {
    // 用户未登录，显示登录按钮
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('userMenu').classList.add('hidden');
  }
});

// 发布留言功能
async function handlePostMessage() {
  if (!auth.currentUser) {
    alert('请先登录');
    return;
  }
  
  const content = document.getElementById('messageContent').value;
  if (!content.trim()) {
    alert('请输入留言内容');
    return;
  }
  
  try {
    const messageData = {
      content,
      userId: auth.currentUser.uid,
      username: auth.currentUser.email.split('@')[0],
      images: [] // 图片处理需要额外实现
    };
    
    await postMessage(messageData);
    document.getElementById('messageContent').value = '';
    // 重新加载留言列表
    renderMessages();
  } catch (error) {
    alert('发布失败，请重试');
    console.error('发布留言失败:', error);
  }
}

// 渲染留言列表
async function renderMessages() {
  const messageList = document.getElementById('messageList');
  messageList.innerHTML = '<div class="loading">加载中...</div>';
  
  try {
    const messages = await getMessages(currentSort);
    
    if (messages.length === 0) {
      messageList.innerHTML = '<div class="text-center py-8 text-gray-500">暂无留言，快来发布第一条吧！</div>';
      return;
    }
    
    messageList.innerHTML = '';
    
    for (const message of messages) {
      // 为每条留言获取评论
      const comments = await getComments(message.id);
      
      // 创建留言卡片并添加到列表
      const card = createMessageCard(message, comments);
      messageList.appendChild(card);
    }
  } catch (error) {
    console.error('加载留言失败:', error);
    messageList.innerHTML = '<div class="text-center py-8 text-red-500">加载失败，请重试</div>';
  }
}

// 其他功能（点赞、评论等）也需要相应更新为使用Firebase函数
```

## 三、部署与安全

### 1. Firebase 托管部署

1. 安装 Firebase CLI：
   ```bash
   npm install -g firebase-tools
   ```

2. 登录 Firebase：
   ```bash
   firebase login
   ```

3. 初始化项目：
   ```bash
   firebase init
   ```
   - 选择 Hosting
   - 选择您的 Firebase 项目
   - 设置 `celebrity-fan-site` 为公共目录
   - 配置为单页应用（如果需要）

4. 部署项目：
   ```bash
   firebase deploy
   ```

### 2. 安全规则配置

在生产环境中，需要配置 Firestore 和 Storage 的安全规则，例如：

**Firestore 规则示例：**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许所有经过认证的用户读取留言和评论
    match /messages/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /comments/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 四、扩展功能

### 1. 实时更新

使用 Firebase 的实时监听功能更新留言列表：

```javascript
import { onSnapshot } from 'firebase/firestore';

// 实时监听留言变化
function setupRealTimeUpdates() {
  const q = query(collection(db, messagesCollection), orderBy('createdAt', 'desc'));
  
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // 处理新增留言
        const newMessage = {
          id: change.doc.id,
          ...change.doc.data()
        };
        addNewMessageToDOM(newMessage);
      }
      if (change.type === 'modified') {
        // 处理修改的留言（如点赞数变化）
        updateMessageInDOM(change.doc.id, change.doc.data());
      }
      if (change.type === 'removed') {
        // 处理删除的留言
        removeMessageFromDOM(change.doc.id);
      }
    });
  });
}
```

### 2. 身份验证增强

添加第三方登录（Google、GitHub 等）：

```javascript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Google 登录
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // 检查用户是否存在，不存在则创建
    const existingUser = await getUserData(user.uid);
    if (!existingUser) {
      await saveUserData(user.uid, {
        username: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        createdAt: new Date()
      });
    }
    
    return user;
  } catch (error) {
    console.error('Google 登录失败:', error);
    throw error;
  }
}
```

## 五、故障排除

### 常见问题

1. **跨域错误**：确保 Firebase 项目设置中的授权域名包含您的网站域名
2. **认证失败**：检查 Firebase 认证服务是否正确启用
3. **数据库读取权限**：确保安全规则允许适当的访问
4. **性能问题**：对于大量数据，考虑使用分页查询和适当的索引

### 调试技巧

- 使用 Firebase 控制台的「监控」功能查看错误
- 添加详细的错误日志记录
- 利用 Firebase CLI 的本地模拟器进行测试

---

通过以上步骤，您可以在粉丝社区网站中成功集成 Firebase，实现用户认证、数据存储和实时功能。如需更多帮助，请参考 [Firebase 官方文档](https://firebase.google.com/docs)。