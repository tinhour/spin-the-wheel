var wheel = document.getElementById('wheel'); // 转盘
    var arrow = document.getElementById('arrow'); // 转盘按钮
    var luckDrawCountDom = document.querySelector('.luckDrawCount span'); // 抽奖次数dom
    // 转盘游戏属性
    var gameState = false;          //  游戏状态
    var luckDrawCount = 3;         //  抽奖次数
    var rotateZPositionCount = 0;   //  当前转盘的rotateZPosition值
    var preUseRotateZ = 0;          //  上一次已抽奖中奖奖品的RotateZ
    var rotateZ = 360;              //  一圈360deg
    var rotateZCount = 10;          //  旋转圈数的倍数
    var runTime = 6;                //  游戏过度时间

    
    var rotateZPosition = [22.5, 157.5, 112.5, 67.5, 202.5];

    const prize = [                 //  奖品设置 传入一个奖项，0，1，2，3，4， 分别是12345等奖
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
    
    // 添加防抖处理
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        }
    }

    // 优化 resize 事件处理
    const optimizedResize = debounce(_resize, 150);
    window.addEventListener('resize', optimizedResize, false);

    // 运行游戏
    function gameAction(rotateZPositionIndex){
        /// 转盘位置计算规则 一圈360deg 乘以 10圈，加上 奖品 rotateZ值，再减去上一次中奖rotateZ值
        var toRotateZCount = (rotateZPositionCount - preUseRotateZ + rotateZPosition[rotateZPositionIndex]) + rotateZ * rotateZCount; // 达到圈数位置
        wheel.style.transition = 'transform '+ runTime +'s ease-in-out 0s'; // 过度时间
        wheel.style.transform = 'rotateZ(' + toRotateZCount + 'deg)'; // 旋转
        preUseRotateZ = rotateZPosition[rotateZPositionIndex]; // 上传抽奖的中奖rotateZ
        rotateZPositionCount = toRotateZCount; // 保存当前转盘值
        luckDrawCount = luckDrawCount-1;  // 游戏次数减一
        
        // 页面更新抽奖次数
        luckDrawCountDom.innerHTML = luckDrawCount;

        //  添加动画结束监听
        wheel.addEventListener('transitionend', function onTransitionEnd() {
            wheel.removeEventListener('transitionend', onTransitionEnd);
            gameState = false;
            onDrawComplete(rotateZPositionIndex);
        }, { once: true });
    }

    // 添加一个统一的消息发送接口
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

    // 修改 onDrawComplete 函数
    function onDrawComplete(rotateZPositionIndex) {
        // 弹出中奖信息
        alert(prize[rotateZPositionIndex].title + '\r\n' + prize[rotateZPositionIndex].prize);

        // 使用统一接口发送消息
        sendMessageToNative({
            type: 'drawResult',
            index: rotateZPositionIndex,
            prize: prize[rotateZPositionIndex]
        });
    }

    // 开始游戏
    arrow.addEventListener('click', function(){
        // 模拟抽奖
        var rotateZPositionIndex = Math.floor(Math.random() * 5); // 生成0到4的随机数
        // 判断游戏是否进行中
        if(gameState) return;
        // 判断是否还有抽奖资格
        if(luckDrawCount <= 0){
            alert('Sorry 您没有抽奖机会了');
            return;
        }
        gameState = true; // 设置游戏当前状态
        // run game
        gameAction(rotateZPositionIndex);
    }, false)
    
    // 假设抽奖次数是通过 JavaScript Bridge 传递的
    function setLuckDrawCount(count) {
        luckDrawCount = count; // 将原生应用传来的抽奖次数存储在变量中
        document.querySelector('.luckDrawCount span').innerText = luckDrawCount; // 更新页面显示
    }

    // 监听来自原生应用的消息
    window.addEventListener('message', function(event) {
        if (event.origin !== "你的原生应用的域名") return; // 确保消息来源可信
        if (event.data.type === 'luckDrawCount') {
            setLuckDrawCount(event.data.count); // 设置抽奖次数
        }
    });

    // 添加资源加载检查
    window.addEventListener('load', function() {
        // 预加载图片
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
                // 动画结束后移除 loading 元素
                setTimeout(() => {
                    loading.remove();
                }, 300);
            }
        }).catch(error => {
            console.error('资源加载失败:', error);
            // 加载失败也需要移除 loading
            const loading = document.getElementById('loading');
            if (loading) {
                loading.remove();
            }
        });
    });

    // 添加网络状态监测
    window.addEventListener('online', function() {
        console.log('网络已连接');
    });

    window.addEventListener('offline', function() {
        alert('网络连接已断开，请检查网络设置');
    });

    // 添加安全检查
    function securityCheck() {
        if (window.self !== window.top) {
            // 防止被嵌入iframe
            window.top.location = window.self.location;
        }
    }

    // 添加作弊检测
    let lastClickTime = 0;
    arrow.addEventListener('click', function(e) {
        const now = Date.now();
        if (now - lastClickTime < 1000) {
            e.preventDefault();
            return;
        }
        lastClickTime = now;
    });
    