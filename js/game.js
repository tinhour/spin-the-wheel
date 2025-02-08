// ================ 1. 常量和变量定义 ================
// DOM 元素
const wheel = document.getElementById('wheel');
const arrow = document.getElementById('arrow');
const luckDrawCountDom = document.querySelector('.luckDrawCount span');

// 游戏配置
const ROTATE_Z = 360;              // 一圈360度
const ROTATE_Z_COUNT = 10;         // 旋转圈数的倍数
const RUN_TIME = 6;                // 游戏过渡时间
const ROTATE_Z_POSITIONS = [22.5, 157.5, 112.5, 67.5, 202.5];  // 奖品位置

// 游戏状态
let gameState = false;             // 游戏状态
let luckDrawCount = 3;             // 抽奖次数
let rotateZPositionCount = 0;      // 当前转盘的rotateZ值
let preUseRotateZ = 0;             // 上一次已抽奖中奖奖品的RotateZ
let lastClickTime = 0;             // 上次点击时间（防作弊用）

// 奖品配置
const PRIZES = [
    {
        title: '手气不错哟～恭喜获得',
        prize: '100元红包', 
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '优惠券礼包',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '5元代金券',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '1元红包',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '优惠券礼包',
    },
];

// ================ 2. 工具函数 ================
// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}

// 安全检查
function securityCheck() {
    if (window.self !== window.top) {
        // 防止被嵌入iframe
        window.top.location = window.self.location;
    }
}

// 向原生应用发送消息
function sendMessageToNative(message) {
    try {
        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.native) {
            // iOS
            window.webkit.messageHandlers.native.postMessage(message);
        } else if (window.Android && typeof window.Android.sendMessage === 'function') {
            // Android
            window.Android.sendMessage(message);
        } else {
            console.log('未检测到原生环境', message);
        }
    } catch (error) {
        console.error('向原生发送消息时出错:', error);
    }
}

// ================ 3. 游戏核心逻辑 ================
// 游戏动作执行
function gameAction(rotateZPositionIndex) {
    // 转盘位置计算
    const toRotateZCount = (rotateZPositionCount - preUseRotateZ + ROTATE_Z_POSITIONS[rotateZPositionIndex]) + ROTATE_Z * ROTATE_Z_COUNT;
    
    // 设置转盘动画
    wheel.style.transition = `transform ${RUN_TIME}s ease-in-out 0s`;
    wheel.style.transform = `rotateZ(${toRotateZCount}deg)`;
    
    // 更新状态
    preUseRotateZ = ROTATE_Z_POSITIONS[rotateZPositionIndex];
    rotateZPositionCount = toRotateZCount;
    luckDrawCount--;
    
    // 更新UI
    luckDrawCountDom.innerHTML = luckDrawCount;

    // 监听动画结束
    wheel.addEventListener('transitionend', function onTransitionEnd() {
        wheel.removeEventListener('transitionend', onTransitionEnd);
        gameState = false;
        onDrawComplete(rotateZPositionIndex);
    }, { once: true });
}

// 抽奖完成处理
function onDrawComplete(rotateZPositionIndex) {
    // 显示中奖信息
    alert(PRIZES[rotateZPositionIndex].title + '\r\n' + PRIZES[rotateZPositionIndex].prize);

    // 发送结果给原生应用
    sendMessageToNative({
        type: 'drawResult',
        index: rotateZPositionIndex,
        prize: PRIZES[rotateZPositionIndex]
    });
}

// 设置抽奖次数
function setLuckDrawCount(count) {
    luckDrawCount = count;
    luckDrawCountDom.innerText = luckDrawCount;
}

// ================ 4. 事件监听 ================
// 点击开始游戏
arrow.addEventListener('click', function(e) {
    // 防作弊检查
    const now = Date.now();
    if (now - lastClickTime < 1000) {
        e.preventDefault();
        return;
    }
    lastClickTime = now;

    // 游戏状态检查
    if (gameState) return;
    if (luckDrawCount <= 0) {
        alert('Sorry 您没有抽奖机会了');
        return;
    }

    // 开始游戏
    gameState = true;
    const rotateZPositionIndex = Math.floor(Math.random() * 5);
    gameAction(rotateZPositionIndex);
}, false);

// 监听屏幕调整
const optimizedResize = debounce(_resize, 150);
window.addEventListener('resize', optimizedResize, false);

// 监听原生应用消息
window.addEventListener('message', function(event) {
    if (event.origin !== "你的原生应用的域名") return;
    if (event.data.type === 'luckDrawCount') {
        setLuckDrawCount(event.data.count);
    }
});

// 监听网络状态
window.addEventListener('online', () => console.log('网络已连接'));
window.addEventListener('offline', () => alert('网络连接已断开，请检查网络设置'));

// 监听资源加载
window.addEventListener('load', function() {
    const images = [
        './images/game-wheel.png',
        './images/game-arrow.png',
        './images/game-bg.png'
    ];
    
    Promise.all(images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    })).then(() => {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hide');
            setTimeout(() => loading.remove(), 300);
        }
    }).catch(error => {
        console.error('资源加载失败:', error);
        const loading = document.getElementById('loading');
        if (loading) loading.remove();
    });
});

// 初始化安全检查
securityCheck();
    