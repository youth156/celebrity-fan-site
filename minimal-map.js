// 极简版地图初始化代码
window.starMap = window.starMap || {};

(function() {
    'use strict';
    
    // 标记数据存储
    let markers = [];
    let map = null;
    
    // 初始化地图 - 极简版本
    function initializeMap(containerId, options = {}) {
        // 在页面上显示调试信息
        showDebugInfo('开始初始化地图，容器ID: ' + containerId);
        
        return new Promise((resolve, reject) => {
            // 检查Mapbox是否已加载
            if (typeof mapboxgl === 'undefined') {
                const errorMsg = '错误: Mapbox GL JS 未加载';
                console.error(errorMsg);
                showDebugInfo(errorMsg, true);
                reject(new Error(errorMsg));
                return;
            }
            
            showDebugInfo('Mapbox已加载');
            
            // 检查容器元素
            const container = document.getElementById(containerId);
            showDebugInfo('地图容器: ' + (container ? '找到' : '未找到'));
            
            if (!container) {
                const errorMsg = '错误: 找不到地图容器元素，ID: ' + containerId;
                console.error(errorMsg);
                showDebugInfo(errorMsg, true);
                reject(new Error(errorMsg));
                return;
            }
            
            try {
                // 设置访问令牌
                mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2wxeXpldGhtMDNvNjNqcW1iNjc5OGZrbSJ9.2X83XK9Vf5gO9jK9qDcQIw';
                showDebugInfo('访问令牌已设置');
                
                // 创建地图实例
                showDebugInfo('准备创建地图实例...');
                map = new mapboxgl.Map({
                    container: containerId,
                    style: 'mapbox://styles/mapbox/streets-v11',
                    center: options.center || [116.3974, 39.9093],
                    zoom: options.zoom || 12
                });
                
                // 添加导航控件
                map.addControl(new mapboxgl.NavigationControl());
                showDebugInfo('地图控件已添加');
                
                // 地图加载完成事件
                map.on('load', function() {
                    const successMsg = '地图加载完成!';
                    console.log(successMsg);
                    showDebugInfo(successMsg, false, true);
                    resolve(map);
                });
                
                // 地图错误事件
                map.on('error', function(e) {
                    const errorMsg = '地图错误: ' + (e.error ? e.error.message : JSON.stringify(e));
                    console.error(errorMsg);
                    showDebugInfo(errorMsg, true);
                    reject(new Error(errorMsg));
                });
                
            } catch (error) {
                const errorMsg = '初始化异常: ' + error.message;
                console.error(errorMsg);
                showDebugInfo(errorMsg, true);
                showDebugInfo('异常堆栈: ' + error.stack, true);
                reject(error);
            }
        });
    }
    
    // 在页面上显示调试信息
    function showDebugInfo(message, isError = false, isSuccess = false) {
        // 尝试在body底部创建调试区域
        let debugArea = document.getElementById('map-debug-info');
        if (!debugArea) {
            debugArea = document.createElement('div');
            debugArea.id = 'map-debug-info';
            debugArea.style.cssText = 'position: fixed; bottom: 10px; left: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; max-height: 200px; overflow-y: auto; z-index: 9999; font-family: monospace; font-size: 12px;';
            document.body.appendChild(debugArea);
        }
        
        const logEntry = document.createElement('div');
        logEntry.textContent = new Date().toLocaleTimeString() + ': ' + message;
        
        if (isError) {
            logEntry.style.color = '#ff6b6b';
        } else if (isSuccess) {
            logEntry.style.color = '#51cf66';
        }
        
        debugArea.appendChild(logEntry);
        
        // 自动滚动到底部
        debugArea.scrollTop = debugArea.scrollHeight;
    }
    
    // 获取当前地图实例
    function getMap() {
        return map;
    }
    
    // 导出方法
    window.starMap = {
        initializeMap: initializeMap,
        getMap: getMap
    };
    
    // 触发地图加载完成事件
    setTimeout(() => {
        const event = new CustomEvent('starMapLoaded');
        window.dispatchEvent(event);
    }, 0);

})();