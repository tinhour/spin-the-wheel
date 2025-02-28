<template>
  <div class="lucky-wheel">
    <div class="wheel-box">
      <div id="wheel" ref="wheelRef">
        <div class="wheel-inner">
          <div v-for="(prize, index) in prizes" 
               :key="index" 
               class="prize-part"
               :style="getPrizeStyle(index)">
            <div class="prize-bg" :style="{ background: colors[index % colors.length] }"></div>
            <div class="prize-text" :style="{ color: textColors[index % textColors.length] }">
              {{ prize.prize }}
            </div>
          </div>
        </div>
      </div>
      <div class="pointer" 
        @click="startRotation"
        :class="{ 'disabled': drawCount === 0 }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LuckyWheel',
  props: {
    // 奖品配置
    prizes: {
      type: Array,
      required: true,
      default: () => []
    },
    // 抽奖次数
    initialDrawCount: {
      type: Number,
      default: 3
    },
    // 转盘颜色配置
    colors: {
      type: Array,
      default: () => ["#f31f49", "#fff7d7", "#a71d77"]
    },
    // 文字颜色配置
    textColors: {
      type: Array,
      default: () => ["#f3f1f1", "#a8213c", "#f3f1f1"]
    },
    // 额外旋转圈数
    additionalTurns:{
      type:Number,
      default: 10
    },
    // 提示文字配置
    messages: {
      type: Object,
      default: () => ({
        noChance: '您没有抽奖机会了'
      })
    }
  },

  data() {
    return {
      currentRotation: 0,
      isRotating: false,
      drawCount: this.initialDrawCount,
      lastClickTime: 0,
      lastRotation: 0
    }
  },

  methods: {
    getPrizeStyle(index) {
      const perAngle = 360 / this.prizes.length;
      return {
        transform: `rotateZ(${perAngle/2 - 90 + perAngle * index}deg)`,
        clipPath: this.getClipPath(perAngle)
      }
    },

    getClipPath(perAngle) {
      const p = perAngle / 2;
      const d = Math.tan(p * Math.PI / 180) * 100;
      const x = (100 - d) / 2;
      return `polygon(0% 50%, 100% ${x}%, 100% ${100 - x}%)`;
    },

    startRotation() {
      // 防抖和状态检查
      const now = Date.now();
      if (now - this.lastClickTime < 1000 || this.isRotating || this.drawCount <= 0) {
        return;
      }
      this.lastClickTime = now;

      if (this.drawCount <= 0) {
        return;
      }

      this.isRotating = true;

      // 随机选择奖品
      const prizeIndex = Math.floor(Math.random() * this.prizes.length);
      const targetAngle = this.getPrizeAngle(prizeIndex);
      
      // 计算旋转角度
      const additionalRotation = 360 * this.additionalTurns;  // 额外旋转10圈
      const totalRotation = this.currentRotation - additionalRotation - targetAngle + this.lastRotation;

      // 应用旋转动画
      const wheelElement = this.$refs.wheelRef;
      wheelElement.style.transform = `rotate(${totalRotation}deg)`;

      // 动画结束后处理
      setTimeout(() => {
        this.isRotating = false;
        this.drawCount--;
        this.currentRotation = totalRotation;
        this.lastRotation = targetAngle;
        this.showResult(prizeIndex);
      }, 5000) ;

      // 触发事件
      this.$emit('on-start', { prizeIndex, drawCount: this.drawCount });
    },

    getPrizeAngle(index) {
      const perAngle = 360 / this.prizes.length;
      return index * perAngle + perAngle / 2;
    },

    showResult(prizeIndex) {
      const prize = this.prizes[prizeIndex];
      this.$emit('on-complete', { 
        index: prizeIndex, 
        prize: prize 
      });
    }
  }
})
</script>

<style scoped>
/* 复制原来的 CSS 样式并做适当调整 */
.lucky-wheel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.wheel-box {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
}

#wheel {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: url('./assets/wheel-bg.png') center center no-repeat;
  background-size: 100% 100%;
  transform-origin: center center;
  transition: transform 5s cubic-bezier(0.46, 0.03, 0, 0.96);
}

/* 转盘内部样式 */
.wheel-inner {
    position: absolute;
    width: 83%;
    height: 83%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    overflow: hidden;
}

.prize-part {
    height: 100%;
    width: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    transform-origin: left center;
    box-sizing: border-box;
}

.prize-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.prize-text {
    transform: translate(0, -50%) rotate(90deg);
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 20%;
    font-size: 1rem;
    padding-top: 0.3rem;
    box-sizing: border-box;
    white-space: nowrap;
    z-index: 1;
}

.pointer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: url('./assets/game-arrow.png') center center no-repeat;
  background-size: contain;
  cursor: pointer;
  z-index: 2;
}

.pointer.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style> 