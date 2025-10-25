// map.js - 星光地图功能模块

// 存储键名常量
// 移除export关键字
const markersKey = 'fanMapMarkers';
const statsKey = 'starMapStats';

// 地图实例和标记数组
let map = null;
let userMarkers = [];
let markerClusters = {};
let animationFrame = null;

// 创建全局starMap命名空间
const starMap = {};

/**
 * 获取保存的标记数据
 * @returns {Array} 标记数组
 */
function getMarkers() {
    const markers = localStorage.getItem(markersKey);
    return markers ? JSON.parse(markers) : [];
}

/**
 * 保存标记数据
 * @param {Array} markers 标记数组
 */
function saveMarkers(markers) {
    localStorage.setItem(markersKey, JSON.stringify(markers));
}

/**
 * 添加新标记
 * @param {Object} markerData 标记数据（包含位置信息、内容等）
 * @returns {Object} 添加的标记对象
 */
function addMarker(markerData) {
    const markers = getMarkers();
    
    const newMarker = {
        id: Date.now().toString(),
        ...markerData,
        timestamp: new Date().toISOString(),
        likes: []
    };
    
    markers.push(newMarker);
    saveMarkers(markers);
    
    // 更新统计数据
    updateStats(newMarker);
    
    return newMarker;
}

/**
 * 删除标记
 * @param {string} markerId 标记ID
 * @returns {boolean} 是否删除成功
 */
function deleteMarker(markerId) {
    const markers = getMarkers();
    const markerIndex = markers.findIndex(m => m.id === markerId);
    
    if (markerIndex === -1) return false;
    
    // 从数组中删除标记
    markers.splice(markerIndex, 1);
    saveMarkers(markers);
    
    // 更新统计数据
    updateTotalStats();
    
    return true;
}

/**
 * 点赞标记
 * @param {string} markerId 标记ID
 * @param {string} username 用户名
 * @returns {boolean} 是否点赞成功
 */
function likeMarker(markerId, username) {
    const markers = getMarkers();
    const marker = markers.find(m => m.id === markerId);
    
    if (!marker) return false;
    
    if (!marker.likes) marker.likes = [];
    if (!marker.likes.includes(username)) {
        marker.likes.push(username);
        saveMarkers(markers);
        return true;
    }
    
    return false;
}

/**
 * 取消点赞标记
 * @param {string} markerId 标记ID
 * @param {string} username 用户名
 * @returns {boolean} 是否取消点赞成功
 */
function unlikeMarker(markerId, username) {
    const markers = getMarkers();
    const marker = markers.find(m => m.id === markerId);
    
    if (!marker || !marker.likes) return false;
    
    const index = marker.likes.indexOf(username);
    if (index !== -1) {
        marker.likes.splice(index, 1);
        saveMarkers(markers);
        return true;
    }
    
    return false;
}

/**
 * 获取统计数据
 * @returns {Object} 统计数据
 */
function getStats() {
    const stats = localStorage.getItem(statsKey);
    return stats ? JSON.parse(stats) : {
        totalMarkers: 0,
        topRegions: {},
        totalLikes: 0,
        activityCount: 0,
        lastUpdate: new Date().toISOString()
    };
}

/**
 * 保存统计数据
 * @param {Object} stats 统计数据
 */
function saveStats(stats) {
    localStorage.setItem(statsKey, JSON.stringify(stats));
}

/**
 * 更新统计数据
 * @param {Object} newMarker 新添加的标记
 */
function updateStats(newMarker) {
    const stats = getStats();
    
    // 更新总标记数
    stats.totalMarkers = getMarkers().length;
    
    // 更新区域统计
    const region = newMarker.city || '未知区域';
    if (!stats.topRegions[region]) {
        stats.topRegions[region] = 0;
    }
    stats.topRegions[region]++;
    
    // 更新活动计数
    stats.activityCount++;
    
    // 更新最后更新时间
    stats.lastUpdate = new Date().toISOString();
    
    saveStats(stats);
}

/**
 * 更新总统计数据
 */
function updateTotalStats() {
    const markers = getMarkers();
    const stats = getStats();
    
    // 重新计算所有统计数据
    stats.totalMarkers = markers.length;
    stats.topRegions = {};
    stats.totalLikes = 0;
    
    markers.forEach(marker => {
        // 统计区域
        const region = marker.city || '未知区域';
        if (!stats.topRegions[region]) {
            stats.topRegions[region] = 0;
        }
        stats.topRegions[region]++;
        
        // 统计点赞数
        if (marker.likes) {
            stats.totalLikes += marker.likes.length;
        }
    });
    
    stats.lastUpdate = new Date().toISOString();
    saveStats(stats);
}

/**
 * 初始化真实的Mapbox地图
 * @param {string} containerId 容器ID
 * @param {Object} options 地图选项
 * @returns {Promise<Object>} 地图实例Promise
 */
function initializeMap(containerId, options = {}) {
    console.log('开始初始化地图...', { containerId, options });
    
    return new Promise((resolve, reject) => {
        // 检查Mapbox是否加载
        if (typeof mapboxgl === 'undefined') {
            console.error('Mapbox未加载');
            
            // 尝试重新加载Mapbox脚本
            const script = document.createElement('script');
            script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
            script.onload = () => {
                console.log('Mapbox脚本重新加载成功');
                // 递归调用，重试初始化
                setTimeout(() => {
                    initializeMap(containerId, options).then(resolve).catch(reject);
                }, 1000);
            };
            script.onerror = () => {
                console.error('Mapbox脚本重新加载失败');
                reject(new Error('Mapbox未加载且重新加载失败'));
            };
            document.body.appendChild(script);
            
            reject(new Error('Mapbox未加载，正在尝试重新加载'));
            return;
        }
        
        // 检查容器元素
        const container = document.getElementById(containerId);
        console.log('地图容器元素:', container);
        if (!container) {
            console.error('错误: 找不到地图容器元素，ID:', containerId);
            reject(new Error('找不到地图容器元素'));
            return;
        }
        
        try {
            // 设置Mapbox访问令牌（使用更可靠的令牌）
            mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmd5dW5nYmFveWVlIiwiYSI6ImNqdGJ0OXBpbjBhZWI0OXBmNjBubW1qazgifQ._h9iWj0fPWG0tLJfK3pJ0A';
            console.log('访问令牌已设置');
            
            // 使用简化但可靠的地图选项
            const mapOptions = {
                container: containerId,
                style: 'mapbox://styles/mapbox/light-v10',
                center: options.center || [116.3974, 39.9093],
                zoom: options.zoom || 2,
                attributionControl: true,
                hash: false,
                interactive: true
            };
            
            console.log('创建地图实例，选项:', mapOptions);
            // 初始化地图
            map = new mapboxgl.Map(mapOptions);
            
            // 添加基本控件
            map.addControl(new mapboxgl.NavigationControl());
            
            // 添加全屏控制
            map.addControl(new mapboxgl.FullscreenControl());
            
            // 简单的错误处理
            map.on('error', function(e) {
                console.error('地图错误:', e);
                reject(e.error || new Error('地图加载失败'));
            });
            
            // 地图加载完成时解析Promise
            map.on('load', function() {
                console.log('地图加载完成!');
                
                // 添加一些预设标记用于测试
                const presetMarkers = [
                    { lng: 116.3974, lat: 39.9093, username: '粉丝小明', city: '北京', country: '中国' },
                    { lng: -73.935242, lat: 40.730610, username: 'BoomFan', city: '纽约', country: '美国' },
                    { lng: 139.691711, lat: 35.689487, username: 'Boom爱好者', city: '东京', country: '日本' },
                    { lng: 2.352222, lat: 48.856614, username: 'Fan123', city: '巴黎', country: '法国' }
                ];
                
                presetMarkers.forEach(markerData => {
                    try {
                        new mapboxgl.Marker()
                            .setLngLat([markerData.lng, markerData.lat])
                            .setPopup(new mapboxgl.Popup().setHTML(
                                `<h4>${markerData.username}</h4><p>${markerData.city}, ${markerData.country}</p>`
                            ))
                            .addTo(map);
                    } catch (error) {
                        console.error('添加预设标记失败:', error);
                    }
                });
                
                console.log('预设标记已添加');
                
                // 初始化按钮事件
                initButtonEventListeners(map);
                
                resolve(map);
            });
            
        } catch (error) {
            console.error('地图初始化异常:', error);
            reject(error);
        }
    });
}

// 初始化按钮事件监听器
function initButtonEventListeners(map) {
    console.log('初始化按钮事件监听器');
    
    // 获取按钮元素
    const addMarkerBtn = document.getElementById('add-marker-btn');
    const addMarkerBtnTop = document.getElementById('add-marker-btn-top');
    const myLocationBtn = document.getElementById('my-location-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveMarkerBtn = document.getElementById('save-marker-btn');
    const modal = document.getElementById('add-marker-modal');
    const modalContent = document.getElementById('modal-content');
    
    console.log('找到的元素:', { 
        addMarkerBtn, addMarkerBtnTop, myLocationBtn, 
        closeModalBtn, saveMarkerBtn, modal, modalContent 
    });
    
    // 添加标记按钮点击事件
    const openModal = () => {
        console.log('打开模态框');
        if (modal && modalContent) {
            modal.classList.remove('hidden');
            // 触发重排，确保动画生效
            void modalContent.offsetHeight;
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
            document.body.style.overflow = 'hidden';
        }
    };
    
    if (addMarkerBtn) {
        addMarkerBtn.addEventListener('click', openModal);
    }
    
    if (addMarkerBtnTop) {
        addMarkerBtnTop.addEventListener('click', openModal);
    }
    
    // 关闭模态框
    const closeModal = () => {
        console.log('关闭模态框');
        if (modal && modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }
    };
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // 保存标记按钮点击事件
    if (saveMarkerBtn && map) {
        saveMarkerBtn.addEventListener('click', () => {
            console.log('保存标记按钮被点击');
            
            // 获取表单数据
            const username = document.getElementById('marker-username')?.value.trim() || '';
            const city = document.getElementById('marker-city')?.value.trim() || '';
            const country = document.getElementById('marker-country')?.value.trim() || '';
            const message = document.getElementById('marker-message')?.value.trim() || '';
            
            console.log('表单数据:', { username, city, country, message });
            
            if (!username || !city || !country) {
                alert('请填写必要的信息（昵称、城市、国家）');
                return;
            }
            
            // 获取当前地图中心点作为标记位置
            const center = map.getCenter();
            console.log('当前地图中心点:', center);
            
            // 添加新标记
            try {
                new mapboxgl.Marker({
                    color: '#ff4500'
                })
                .setLngLat([center.lng, center.lat])
                .setPopup(new mapboxgl.Popup().setHTML(
                    `<h4>${username}</h4>
                     <p>${city}, ${country}</p>
                     ${message ? `<p class="text-sm">${message}</p>` : ''}`
                ))
                .addTo(map);
                
                alert('标记已成功添加！');
                closeModal();
                
                // 清空表单
                const form = document.getElementById('add-marker-form');
                if (form) form.reset();
                
                console.log('标记添加成功');
            } catch (error) {
                console.error('添加标记失败:', error);
                alert('添加标记失败，请重试');
            }
        });
    }
    
    // 我的位置按钮点击事件
    if (myLocationBtn && map) {
        myLocationBtn.addEventListener('click', () => {
            console.log('获取我的位置按钮被点击');
            
            // 保存原始文本
            const originalText = myLocationBtn.textContent;
            myLocationBtn.textContent = '定位中...';
            
            if (!navigator.geolocation) {
                alert('您的浏览器不支持地理定位');
                myLocationBtn.textContent = originalText;
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    try {
                        console.log('获取位置成功:', position.coords);
                        
                        // 移动到用户位置
                        map.flyTo({
                            center: [position.coords.longitude, position.coords.latitude],
                            zoom: 10,
                            essential: true
                        });
                        
                        // 添加用户位置标记
                        new mapboxgl.Marker({
                            color: '#2196F3'
                        })
                        .setLngLat([position.coords.longitude, position.coords.latitude])
                        .setPopup(new mapboxgl.Popup().setHTML('<h4>我的位置</h4>'))
                        .addTo(map);
                        
                        myLocationBtn.textContent = originalText;
                    } catch (error) {
                        console.error('定位后移动地图失败:', error);
                        myLocationBtn.textContent = originalText;
                        alert('定位成功，但移动地图失败');
                    }
                },
                (error) => {
                    console.error('获取位置失败:', error);
                    myLocationBtn.textContent = originalText;
                    
                    let errorMessage = '获取位置失败';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = '请允许访问您的位置';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = '位置信息不可用';
                            break;
                        case error.TIMEOUT:
                            errorMessage = '获取位置超时';
                            break;
                    }
                    alert(errorMessage);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }
    
    console.log('按钮事件监听器初始化完成');
}
}

/**
 * 添加星空背景效果
 */
function addStarfieldEffect() {
    if (!map) return;
    
    // 创建星空背景图层
    map.addSource('starfield', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': []
        }
    });
    
    // 生成随机星星
    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    -180 + Math.random() * 360,
                    -90 + Math.random() * 180
                ]
            },
            'properties': {
                'brightness': Math.random() * 0.7 + 0.3,
                'size': Math.random() * 2 + 1
            }
        });
    }
    
    map.getSource('starfield').setData({
        'type': 'FeatureCollection',
        'features': stars
    });
    
    map.addLayer({
        'id': 'stars',
        'type': 'circle',
        'source': 'starfield',
        'paint': {
            'circle-color': 'rgba(255, 255, 255, [' +
                'get("brightness")' +
            '])',
            'circle-radius': ['get', 'size'],
            'circle-blur': 0.5,
            'circle-stroke-width': 0
        },
        'filter': ['==', '$type', 'Point']
    });
}

/**
 * 初始化聚类数据
 */
function initClusterData() {
    const markers = getMarkers();
    markerClusters = {};
    
    // 简单的网格聚类算法
    const gridSize = 2; // 网格大小（度）
    
    markers.forEach(marker => {
        const gridKey = `${Math.floor(marker.lng / gridSize) * gridSize},${Math.floor(marker.lat / gridSize) * gridSize}`;
        
        if (!markerClusters[gridKey]) {
            markerClusters[gridKey] = {
                lng: Math.floor(marker.lng / gridSize) * gridSize + gridSize / 2,
                lat: Math.floor(marker.lat / gridSize) * gridSize + gridSize / 2,
                markers: [],
                count: 0
            };
        }
        
        markerClusters[gridKey].markers.push(marker);
        markerClusters[gridKey].count++;
    });
}

/**
 * 更新聚类显示
 */
function updateClusterDisplay() {
    if (!map) return;
    
    // 根据缩放级别决定是否显示聚类
    const zoom = map.getZoom();
    
    // 当缩放级别较高时，显示单个标记；较低时可以考虑显示聚类
    // 这里我们暂时不实现聚类标记的可视化，只更新标记的显示状态
    
    // 可以根据需要扩展此功能
}

/**
 * 创建自定义标记元素
 * @param {Object} markerData 标记数据
 * @returns {HTMLElement} 标记元素
 */
function createCustomMarker(markerData) {
    const el = document.createElement('div');
    el.className = 'star-map-marker';
    
    // 根据标记是否有照片设置不同样式
    const hasPhoto = markerData.photo ? 'has-photo' : '';
    
    el.style.cssText = `
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #6c38ff, #9a5bff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(108, 56, 255, 0.6);
        animation: pulse 2s infinite;
        border: 2px solid white;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        will-change: transform, box-shadow;
    `;
    
    // 星星图标 - 根据点赞数设置不同样式
    const likeCount = markerData.likes ? markerData.likes.length : 0;
    const starColor = likeCount > 0 ? 'text-yellow-300' : 'text-white';
    
    el.innerHTML = `
        <i class="fa fa-star ${starColor}"></i>
        ${hasPhoto ? '<span class="photo-indicator"></span>' : ''}
    `;
    
    // 照片指示器样式
    if (hasPhoto) {
        const indicator = el.querySelector('.photo-indicator');
        indicator.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 8px;
            height: 8px;
            background: #FF5E7D;
            border-radius: 50%;
            border: 1px solid white;
        `;
    }
    
    // 添加点击和悬停效果
    el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3) translateY(-4px)';
        el.style.boxShadow = '0 0 30px rgba(108, 56, 255, 0.8)';
        el.style.zIndex = '1000';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1) translateY(0)';
        el.style.boxShadow = '0 0 20px rgba(108, 56, 255, 0.6)';
        el.style.zIndex = '1';
    });
    
    // 添加点击动画
    el.addEventListener('click', () => {
        el.style.transform = 'scale(0.9)';
        setTimeout(() => {
            el.style.transform = 'scale(1.2)';
        }, 100);
    });
    
    return el;
}

/**
 * 创建标记弹出框
 * @param {Object} markerData 标记数据
 * @returns {mapboxgl.Popup} 弹出框实例
 */
function createMarkerPopup(markerData) {
    const likeCount = markerData.likes ? markerData.likes.length : 0;
    const isLiked = markerData.likes && markerData.likes.includes(currentUser?.username);
    const heartClass = isLiked ? 'text-red-500' : 'text-gray-500';
    
    const popupContent = `
        <div class="p-3 star-popup">
            <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-gray-900">${escapeHTML(markerData.username)}</h4>
                <span class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">${escapeHTML(markerData.city)}</span>
            </div>
            <p class="text-gray-700 text-sm mb-3">${escapeHTML(markerData.message)}</p>
            ${markerData.photo ? `
                <div class="relative mb-3 overflow-hidden rounded-lg group">
                    <img src="${markerData.photo}" alt="用户照片" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                        <button class="view-photo-btn bg-white/90 text-gray-800 rounded-full px-3 py-1 text-xs font-medium">
                            <i class="fa fa-search-plus mr-1"></i>查看大图
                        </button>
                    </div>
                </div>
            ` : ''}
            <div class="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
                <p class="text-gray-400 text-xs">${formatDate(markerData.timestamp)}</p>
                <div class="flex items-center space-x-3">
                    <button class="like-marker-btn ${heartClass} hover:text-red-500 transition-all duration-300" data-id="${markerData.id}">
                        <i class="fa fa-heart mr-1"></i>
                        <span>${likeCount}</span>
                    </button>
                    ${currentUser && currentUser.username === markerData.username ? `
                        <button class="delete-marker-btn text-gray-400 hover:text-red-500 transition-colors" data-id="${markerData.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    const popup = new mapboxgl.Popup({
        offset: 25,
        maxWidth: '320px',
        className: 'star-popup-container',
        closeButton: true,
        closeOnClick: true
    }).setHTML(popupContent);
    
    return popup;
}

/**
 * 加载并显示所有标记
 * @param {Object} currentUser 当前用户
 * @param {Function} showNotification 通知函数
 */
function loadMarkers(currentUser, showNotification) {
    if (!map) {
        console.error('地图尚未初始化');
        return;
    }
    
    // 清除现有标记
    clearMarkers();
    
    const markers = getMarkers();
    
    // 存储全局currentUser引用用于popup中使用
    window.currentUser = currentUser;
    
    // 标记淡入动画
    markers.forEach((markerData, index) => {
        setTimeout(() => {
            const el = createCustomMarker(markerData);
            const popup = createMarkerPopup(markerData);
            
            // 设置初始样式
            el.style.opacity = '0';
            el.style.transform = 'scale(0.5) translateY(10px)';
            
            const mapMarker = new mapboxgl.Marker(el)
                .setLngLat([markerData.lng, markerData.lat])
                .setPopup(popup)
                .addTo(map);
            
            // 存储标记引用
            userMarkers.push({
                id: markerData.id,
                mapboxMarker: mapMarker,
                data: markerData
            });
            
            // 淡入动画
            setTimeout(() => {
                el.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                el.style.opacity = '1';
                el.style.transform = 'scale(1) translateY(0)';
            }, 50);
            
            // 添加弹出框打开事件，绑定点赞和删除功能
            popup.on('open', () => {
                const popupContent = popup._content;
                
                // 点赞按钮事件
                const likeBtn = popupContent.querySelector('.like-marker-btn');
                if (likeBtn && currentUser) {
                    likeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const markerId = this.getAttribute('data-id');
                        
                        // 点赞动画
                        this.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 100);
                        
                        // 检查是否已点赞
                        const marker = markers.find(m => m.id === markerId);
                        if (marker && marker.likes && marker.likes.includes(currentUser.username)) {
                            // 取消点赞
                            if (unlikeMarker(markerId, currentUser.username)) {
                                this.querySelector('i').className = 'fa fa-heart mr-1';
                                this.querySelector('span').textContent = marker.likes.length - 1;
                                this.classList.remove('text-red-500');
                                this.classList.add('text-gray-500');
                                showNotification && showNotification('已取消点赞', 'info');
                            }
                        } else {
                            // 添加点赞
                            if (likeMarker(markerId, currentUser.username)) {
                                this.querySelector('i').className = 'fa fa-heart mr-1 text-red-500';
                                this.querySelector('span').textContent = marker.likes ? marker.likes.length + 1 : 1;
                                this.classList.remove('text-gray-500');
                                this.classList.add('text-red-500');
                                showNotification && showNotification('点赞成功！', 'success');
                            }
                        }
                    });
                }
                
                // 删除按钮事件
                const deleteBtn = popupContent.querySelector('.delete-marker-btn');
                if (deleteBtn && currentUser) {
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const markerId = this.getAttribute('data-id');
                        
                        if (confirm('确定要删除这个标记吗？')) {
                            if (deleteMarker(markerId)) {
                                // 关闭弹出框
                                popup.remove();
                                
                                // 重新加载标记
                                loadMarkers(currentUser, showNotification);
                                updateMapStats();
                                
                                showNotification && showNotification('标记已删除', 'success');
                            }
                        }
                    });
                }
                
                // 查看大图按钮事件
                const viewPhotoBtn = popupContent.querySelector('.view-photo-btn');
                if (viewPhotoBtn && markerData.photo) {
                    viewPhotoBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        showPhotoModal(markerData.photo);
                    });
                }
            });
            
        }, index * 50); // 错开加载时间，创造流动效果
    });
    
    console.log(`已加载 ${userMarkers.length} 个标记`);
}

/**
 * 显示照片模态框
 * @param {string} photoUrl 照片URL
 */
function showPhotoModal(photoUrl) {
    // 检查是否已存在模态框
    let modal = document.getElementById('photo-modal');
    if (!modal) {
        // 创建模态框
        modal = document.createElement('div');
        modal.id = 'photo-modal';
        modal.className = 'fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300';
        modal.innerHTML = `
            <div class="relative max-w-4xl max-h-[90vh]">
                <button id="close-photo-modal" class="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors">
                    <i class="fa fa-times"></i>
                </button>
                <img id="modal-photo" src="" alt="大图预览" class="max-w-full max-h-[90vh] object-contain rounded-lg">
            </div>
        `;
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        document.getElementById('close-photo-modal').addEventListener('click', () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    }
    
    // 设置照片
    document.getElementById('modal-photo').src = photoUrl;
    
    // 显示模态框
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

/**
 * 清除所有标记
 */
function clearMarkers() {
    userMarkers.forEach(({ mapboxMarker }) => {
        if (mapboxMarker) {
            mapboxMarker.remove();
        }
    });
    userMarkers = [];
}

/**
 * 移动地图到指定标记
 * @param {string} markerId 标记ID
 * @param {number} zoom 缩放级别
 */
function flyToMarker(markerId, zoom = 8) {
    const marker = userMarkers.find(m => m.id === markerId);
    if (marker && map) {
        map.flyTo({
            center: [marker.data.lng, marker.data.lat],
            zoom: zoom,
            essential: true
        });
        
        // 打开弹出框
        marker.mapboxMarker.togglePopup();
    }
}

/**
 * 获取最近活动标记
 * @param {number} limit 限制数量
 * @returns {Array} 最近活动标记数组
 */
function getRecentMarkers(limit = 5) {
    const markers = getMarkers();
    return markers
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

/**
 * 获取区域分布统计
 * @returns {Array} 区域统计数组
 */
function getRegionStats() {
    const stats = getStats();
    const regions = Object.entries(stats.topRegions)
        .map(([region, count]) => ({ name: region, value: count }))
        .sort((a, b) => b.value - a.value);
    
    return regions;
}

/**
 * 更新地图统计显示
 */
function updateMapStats() {
    const markers = getMarkers();
    const cities = new Set(markers.map(m => m.city).filter(Boolean));
    
    // 模拟国家数据（实际项目中应该使用真实的地理数据）
    const countries = new Set(['中国']); // 简化处理
    
    // 更新UI显示
    const elements = {
        'total-fans': markers.length,
        'total-markers': markers.length,
        'total-cities': cities.size,
        'total-countries': countries.size
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            // 添加数字变化动画
            animateNumber(element, parseInt(element.textContent || '0'), value);
        }
    });
}

/**
 * 添加示例标记数据（用于测试）
 */
function addExampleMarkers() {
    const exampleMarkers = [
        {
            username: '星光守护者',
            city: '北京',
            message: 'Boom永远是最棒的！❤️',
            lng: 116.3974,
            lat: 39.9093
        },
        {
            username: '超级粉丝',
            city: '上海',
            message: '期待新剧开播！',
            lng: 121.4737,
            lat: 31.2304
        },
        {
            username: 'FanGirl123',
            city: '广州',
            message: '祝Boom生日快乐！🎉',
            lng: 113.2644,
            lat: 23.1291
        },
        {
            username: '泰国粉丝',
            city: '曼谷',
            message: 'Boom is the best! 🇹🇭',
            lng: 100.5018,
            lat: 13.7563
        },
        {
            username: '国际粉丝',
            city: '东京',
            message: 'I love Boom! 大好き！',
            lng: 139.6917,
            lat: 35.6895
        }
    ];
    
    const existingMarkers = getMarkers();
    
    // 检查是否已有示例标记，避免重复添加
    if (existingMarkers.length === 0) {
        exampleMarkers.forEach(markerData => {
            addMarker(markerData);
        });
        console.log('已添加示例标记数据');
    }
}

/**
 * 数字变化动画
 * @param {HTMLElement} element 目标元素
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {number} duration 持续时间
 */
function animateNumber(element, start, end, duration = 1000) {
    // 取消之前的动画
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // 使用更平滑的缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3); // 三次方缓动
        
        const currentValue = Math.floor(start + (end - start) * easeProgress);
        
        // 添加千位分隔符
        element.textContent = currentValue.toLocaleString();
        
        // 添加数字变化时的缩放效果
        element.style.transform = `scale(${1 + Math.abs(currentValue - start) / Math.max(Math.abs(end - start), 1) * 0.1})`;
        
        if (progress < 1) {
            animationFrame = requestAnimationFrame(animation);
        } else {
            // 动画结束，重置缩放
            element.style.transform = 'scale(1)';
            animationFrame = null;
        }
    }
    
    animationFrame = requestAnimationFrame(animation);
}

/**
 * 防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * HTML转义
 * @param {string} str 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * 格式化日期
 * @param {string} dateString 日期字符串
 * @param {string} currentLang 当前语言
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString, currentLang = 'zh') {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // 多语言配置
    const translations = {
        zh: {
            'just-now': '刚刚',
            'minutes-ago': '分钟前',
            'hours-ago': '小时前',
            'days-ago': '天前'
        },
        en: {
            'just-now': 'Just now',
            'minutes-ago': 'minutes ago',
            'hours-ago': 'hours ago',
            'days-ago': 'days ago'
        },
        th: {
            'just-now': 'เพิ่งจะ',
            'minutes-ago': 'นาทีที่แล้ว',
            'hours-ago': 'ชั่วโมงที่แล้ว',
            'days-ago': 'วันที่แล้ว'
        }
    };
    
    const lang = translations[currentLang] || translations.zh;
    
    if (diffMins < 1) return lang['just-now'];
    if (diffMins < 60) return `${diffMins} ${lang['minutes-ago']}`;
    if (diffHours < 24) return `${diffHours} ${lang['hours-ago']}`;
    if (diffDays < 30) return `${diffDays} ${lang['days-ago']}`;
    
    return date.toLocaleDateString(currentLang === 'zh' ? 'zh-CN' : currentLang === 'th' ? 'th-TH' : 'en-US');
}

// 添加CSS动画样式
function addMapStyles() {
    const styleId = 'star-map-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(108, 56, 255, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(108, 56, 255, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(108, 56, 255, 0);
            }
        }
        
        .star-map-marker:hover {
            transform: scale(1.2);
            z-index: 1000;
        }
        
        .star-popup {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .star-popup h4 {
            margin: 0;
        }
        
        .star-popup img {
            transition: transform 0.3s ease;
        }
        
        .star-popup img:hover {
            transform: scale(1.05);
        }
        
        .like-marker-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .like-marker-btn:hover {
            background-color: rgba(239, 68, 68, 0.1);
        }
        
        .mapboxgl-popup-content {
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border: none;
            overflow: hidden;
        }
        
        .mapboxgl-popup-tip {
            background-color: white;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
    `;
    
    document.head.appendChild(style);
}

// 初始化时添加样式
addMapStyles();

// 导出地图实例获取方法
function getMap() {
    return map;
}

// 导出核心函数到starMap命名空间
starMap.getMarkers = getMarkers;
starMap.saveMarkers = saveMarkers;
starMap.addMarker = addMarker;
starMap.deleteMarker = deleteMarker;
starMap.likeMarker = likeMarker;
starMap.unlikeMarker = unlikeMarker;
starMap.getStats = getStats;
starMap.saveStats = saveStats;
starMap.updateStats = updateStats;
starMap.updateTotalStats = updateTotalStats;
starMap.initializeMap = initializeMap;
starMap.loadMarkers = loadMarkers;
starMap.clearMarkers = clearMarkers;
starMap.flyToMarker = flyToMarker;
starMap.getRecentMarkers = getRecentMarkers;
starMap.getRegionStats = getRegionStats;
starMap.updateMapStats = updateMapStats;
starMap.addExampleMarkers = addExampleMarkers;
starMap.getMap = getMap;
// 修复重复定义

// 增强标记聚类功能
markerClusters.createClusters = function(markers, zoom) {
    const currentZoom = zoom || 3;
    const clusters = {};
    const zoomIndex = Math.min([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].length - 1, Math.max(0, currentZoom - 2));
    const cellSize = Math.pow(2, 9 - zoomIndex); // 单元格大小随缩放级别变化
    
    markers.forEach(marker => {
        // 创建网格键值
        const key = `${Math.floor(marker.lng / cellSize)}-${Math.floor(marker.lat / cellSize)}`;
        
        if (!clusters[key]) {
            clusters[key] = {
                lng: 0,
                lat: 0,
                count: 0,
                markers: []
            };
        }
        
        clusters[key].lng += marker.lng;
        clusters[key].lat += marker.lat;
        clusters[key].count++;
        clusters[key].markers.push(marker);
    });
    
    // 计算每个聚类的中心点
    Object.keys(clusters).forEach(key => {
        clusters[key].lng /= clusters[key].count;
        clusters[key].lat /= clusters[key].count;
    });
    
    return clusters;
};

markerClusters.update = function(markers, zoom) {
    this.clusters = this.createClusters(markers, zoom);
    return this.clusters;
};

// 将starMap暴露到全局window对象 - 修复模块加载问题
if (typeof window !== 'undefined') {
    // 确保starMap对象存在
    if (!window.starMap) {
        window.starMap = {};
    }
    
    // 合并starMap对象，保留可能已存在的属性
    Object.assign(window.starMap, starMap);
    
    console.log('Star Map module loaded and exposed to window object');
    
    // 触发模块加载完成事件
    try {
        const event = new CustomEvent('starMapLoaded');
        window.dispatchEvent(event);
        console.log('starMapLoaded event dispatched');
    } catch (e) {
        console.error('Failed to dispatch starMapLoaded event:', e);
    }
}

// 不再需要export语句，因为以非模块方式引入