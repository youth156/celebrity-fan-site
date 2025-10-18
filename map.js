// map.js - 星光地图功能模块

// 存储键名常量
const markersKey = 'starMapMarkers';
const statsKey = 'starMapStats';

/**
 * 获取保存的标记数据
 * @returns {Array} 标记数组
 */
export function getMarkers() {
    const markers = localStorage.getItem(markersKey);
    return markers ? JSON.parse(markers) : [];
}

/**
 * 保存标记数据
 * @param {Array} markers 标记数组
 */
export function saveMarkers(markers) {
    localStorage.setItem(markersKey, JSON.stringify(markers));
}

/**
 * 添加新标记
 * @param {Object} markerData 标记数据（包含位置信息、内容等）
 * @returns {Object} 添加的标记对象
 */
export function addMarker(markerData) {
    const markers = getMarkers();
    
    const newMarker = {
        id: Date.now().toString(),
        ...markerData,
        timestamp: new Date().toISOString()
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
export function deleteMarker(markerId) {
    const markers = getMarkers();
    const markerIndex = markers.findIndex(m => m.id === markerId);
    
    if (markerIndex === -1) return false;
    
    // 从数组中删除标记
    markers.splice(markerIndex, 1);
    saveMarkers(markers);
    
    return true;
}

/**
 * 获取统计数据
 * @returns {Object} 统计数据
 */
export function getStats() {
    const stats = localStorage.getItem(statsKey);
    return stats ? JSON.parse(stats) : {
        totalMarkers: 0,
        topRegions: {},
        totalComments: 0,
        activityCount: 0,
        lastUpdate: new Date().toISOString()
    };
}

/**
 * 保存统计数据
 * @param {Object} stats 统计数据
 */
export function saveStats(stats) {
    localStorage.setItem(statsKey, JSON.stringify(stats));
}

/**
 * 更新统计数据
 * @param {Object} newMarker 新添加的标记
 */
export function updateStats(newMarker) {
    const stats = getStats();
    
    // 更新总标记数
    stats.totalMarkers = getMarkers().length;
    
    // 更新区域统计
    const region = newMarker.region || '未知区域';
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
 * 初始化地图（模拟Mapbox初始化）
 * @param {string} containerId 容器ID
 * @param {Object} options 地图选项
 * @returns {Object} 地图实例
 */
export function initMap(containerId, options = {}) {
    // 模拟Mapbox初始化，实际项目中应替换为真实的Mapbox初始化代码
    console.log('初始化地图:', containerId, options);
    
    return {
        container: document.getElementById(containerId),
        // 模拟地图方法
        addMarker: function(markerData) {
            console.log('添加地图标记:', markerData);
            return { id: Date.now().toString() };
        },
        removeMarker: function(markerId) {
            console.log('删除地图标记:', markerId);
        }
    };
}

/**
 * 获取最近活动标记
 * @param {number} limit 限制数量
 * @returns {Array} 最近活动标记数组
 */
export function getRecentMarkers(limit = 5) {
    const markers = getMarkers();
    return markers
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}

/**
 * 获取区域分布统计
 * @returns {Array} 区域统计数组
 */
export function getRegionStats() {
    const stats = getStats();
    const regions = Object.entries(stats.topRegions)
        .map(([region, count]) => ({ name: region, value: count }))
        .sort((a, b) => b.value - a.value);
    
    return regions;
}