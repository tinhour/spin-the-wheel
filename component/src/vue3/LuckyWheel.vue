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
import { defineComponent, ref } from 'vue'
import type { Prize } from './types'

export default defineComponent({
  name: 'LuckyWheel',
  props: {
    prizes: {
      type: Array as () => Prize[],
      required: true,
      default: () => []
    },
    initialDrawCount: {
      type: Number,
      default: 3
    },
    colors: {
      type: Array as () => string[],
      default: () => ["#f31f49", "#fff7d7", "#a71d77"]
    },
    textColors: {
      type: Array as () => string[],
      default: () => ["#f3f1f1", "#a8213c", "#f3f1f1"]
    },
    additionalTurns: {
      type: Number,
      default: 10
    },
    messages: {
      type: Object as () => { noChance: string },
      default: () => ({
        noChance: '您没有抽奖机会了'
      })
    }
  },

  setup(props, { emit }) {
    const currentRotation = ref(0)
    const isRotating = ref(false)
    const drawCount = ref(props.initialDrawCount)
    const lastClickTime = ref(0)
    const lastRotation = ref(0)
    const wheelRef = ref<HTMLElement | null>(null)

    const getPrizeStyle = (index: number) => {
      const perAngle = 360 / props.prizes.length
      const p = perAngle / 2
      const d = Math.tan(p * Math.PI / 180) * 100
      const x = (100 - d) / 2
      
      return {
        transform: `rotateZ(${perAngle/2 - 90 + perAngle * index}deg)`,
        clipPath: `polygon(0% 50%, 100% ${x}%, 100% ${100 - x}%)`
      }
    }

    const startRotation = () => {
      const now = Date.now()
      if (now - lastClickTime.value < 1000 || isRotating.value || drawCount.value <= 0) {
        return
      }
      lastClickTime.value = now

      if (drawCount.value <= 0) {
        return
      }

      isRotating.value = true
      
      // 随机选择奖品
      const prizeIndex = Math.floor(Math.random() * props.prizes.length)
      const perAngle = 360 / props.prizes.length
      const targetAngle = prizeIndex * perAngle + perAngle / 2
      
      // 计算旋转角度
      const additionalRotation = 360 * props.additionalTurns
      const totalRotation = currentRotation.value - additionalRotation - targetAngle + lastRotation.value

      // 应用旋转动画
      if (wheelRef.value) {
        wheelRef.value.style.transform = `rotate(${totalRotation}deg)`
      }

      // 触发开始事件
      emit('on-start', { prizeIndex, drawCount: drawCount.value - 1 })

      // 动画结束后处理
      setTimeout(() => {
        drawCount.value--
        isRotating.value = false
        currentRotation.value = totalRotation
        lastRotation.value = targetAngle
        const prize = props.prizes[prizeIndex]
        emit('on-complete', { index: prizeIndex, prize })
      }, 5000)
    }

    return {
      currentRotation,
      isRotating,
      drawCount,
      lastClickTime,
      lastRotation,
      wheelRef,
      getPrizeStyle,
      startRotation
    }
  }
})
</script>

<style scoped>
/* 复制原来的 CSS 样式 */
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