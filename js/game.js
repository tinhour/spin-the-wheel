// ================ 1. 常量和变量定义 ================
// DOM 元素
const wheel = document.getElementById('wheel');
const arrow = document.getElementById('arrow');
const luckDrawCountDom = document.querySelector('.luckDrawCount span');

// 奖品配置
const PRIZES = [
    {
        title: '手气不错哟～恭喜获得',
        prize: '一等奖', 
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '二等奖',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '三等奖',
    },
    {
        title: '下次再来',
        prize: '谢谢惠顾',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '四等奖',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '五等奖',
    },
    {
        title: '手气不错哟～恭喜获得',
        prize: '六等奖',
    },
    {
        title: '再来一次',
        prize: '谢谢惠顾',
    }
];
// const PRIZES = [];
// for(var i=1;i<=10;i++){
//     PRIZES.push({
//         title: i.toString(),
//         prize:i.toString(),
//     })
// }
// 转盘颜色配置
const COLORS = ["#f31f49", "#fff7d7", "#a71d77"];
const TEXT_COLORS = ["#f3f1f1", "#a8213c", "#f3f1f1"];

// 游戏配置
const ROTATE_Z = 360;              // 一圈360度
const ROTATE_Z_COUNT = 10;         // 旋转圈数的倍数
const RUN_TIME = 6;                // 游戏过渡时间
// 根据奖品数量计算每个奖品的角度位置
const PRIZE_COUNT = PRIZES.length;
const PRIZE_ANGLE = 360 / PRIZE_COUNT;  // 每个奖品占的角度
// 计算每个奖品的指针指向角度（从顶部开始，顺时针计算）
const ROTATE_Z_POSITIONS = Array.from({ length: PRIZE_COUNT }, (_, i) => {
    // 从0度开始，顺时针旋转，加上半个扇形的偏移使指针指向奖品中心
    return i * PRIZE_ANGLE + PRIZE_ANGLE / 2;
});

// 游戏状态
let gameState = false;             // 游戏状态
let luckDrawCount = 3;             // 抽奖次数
let currentRotation = 0;           // 当前转盘的旋转角度
let lastRotation = 0;             // 上次转盘的旋转角度
let lastClickTime = 0;             // 上次点击时间（防作弊用）

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
// 初始化转盘
function initWheel() {
    const wheelInner = document.querySelector('.wheel-inner');
    const template = document.querySelector('#prize-template');
    const perAngle = 360 / PRIZES.length;
    
    PRIZES.forEach((prize, index) => {
        const node = template.cloneNode(true);
        node.style.display = 'block';
        // 扇形区块从顶部开始，顺时针排列
        node.style.transform = `rotateZ(${perAngle/2 - 90 + perAngle * index}deg)`;
        
        // 设置背景色和文字颜色
        node.querySelector('.prize-bg').style.background = COLORS[index % COLORS.length];
        node.querySelector('.prize-text').style.color = TEXT_COLORS[index % TEXT_COLORS.length];
        
        // 设置文字
        node.querySelector('.prize-text').textContent = prize.prize;
        
        // 设置扇形区域
        const p = perAngle / 2;
        const d = Math.tan(p * Math.PI / 180) * 100;
        const x = (100 - d) / 2;
        node.style.clipPath = `polygon(0% 50%, 100% ${x}%, 100% ${100 - x}%)`;
        
        wheelInner.appendChild(node);
    });
}

// 游戏动作执行
function gameAction(rotateZPositionIndex) {
    // 计算目标角度
    const targetAngle = ROTATE_Z_POSITIONS[rotateZPositionIndex];
    // 计算需要旋转的总角度
    const additionalRotation = ROTATE_Z * ROTATE_Z_COUNT;  // 额外旋转的圈数
    // 计算新的总旋转角度：当前角度 + 额外圈数 + 目标角度的补角 - 上次旋转的补角度
    const totalRotation =  currentRotation - additionalRotation - targetAngle + lastRotation;
    // 设置转盘动画
    requestAnimationFrame(() => {
        wheel.style.transform = `rotate(${totalRotation}deg)`;
    });
    
    // 更新状态
    currentRotation = totalRotation;
    lastRotation = targetAngle;
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

// 显示模态框
function showModal(message) {
    document.getElementById('modalMessage').innerText = message; // 设置模态框内容
    document.getElementById('modal').style.display = 'block'; // 显示模态框
}

// 关闭模态框
document.getElementById('modalClose').onclick = function() {
    document.getElementById('modal').style.display = 'none'; // 隐藏模态框
}

// 抽奖完成处理
function onDrawComplete(rotateZPositionIndex) {
    // 显示中奖信息
    showModal(PRIZES[rotateZPositionIndex].title + '\r\n' + PRIZES[rotateZPositionIndex].prize);

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
        showModal('Sorry 您没有抽奖机会了'); // 显示没有抽奖机会的提示
        return;
    }

    // 开始游戏
    gameState = true;
    const rotateZPositionIndex = Math.floor(Math.random() * PRIZE_COUNT);
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
window.addEventListener('offline', () => showModal('网络连接已断开，请检查网络设置')); // 显示网络断开的提示

// 监听资源加载
window.addEventListener('load', function() {
    const images = [
        './images/wheel-bg.png',
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

    initWheel();
});

// 初始化安全检查
securityCheck();
    