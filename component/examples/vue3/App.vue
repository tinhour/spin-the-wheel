<template>
  <div class="app">
    <h1>Lucky Wheel Vue 3 Demo</h1>
    <LuckyWheel 
      :prizes="prizes"
      :initialDrawCount="3"
      :additionalTurns="10"
      :messages="{
        noChance: '您没有抽奖机会了'
      }"
      @on-start="handleStart"
      @on-complete="handleComplete"
    />
    <div class="info">
      <h2>Events Log:</h2>
      <div class="log">{{ eventLog }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LuckyWheel from '../../src/vue3/LuckyWheel.vue'

const eventLog = ref('')

const prizes = [
  { title: '恭喜获得', prize: '一等奖' },
  { title: '恭喜获得', prize: '二等奖' },
  { title: '恭喜获得', prize: '三等奖' },
  { title: '下次再来', prize: '谢谢惠顾' },
  { title: '恭喜获得', prize: '四等奖' },
  { title: '恭喜获得', prize: '五等奖' },
  { title: '恭喜获得', prize: '六等奖' },
  { title: '再来一次', prize: '谢谢惠顾' }
]

const handleStart = ({ prizeIndex, drawCount }: { prizeIndex: number; drawCount: number }) => {
  eventLog.value = `开始抽奖: 奖品索引 ${prizeIndex}, 剩余次数 ${drawCount}\n${eventLog.value}`
}

const handleComplete = ({ index, prize }: { index: number; prize: { title: string; prize: string } }) => {
  eventLog.value = `抽奖完成: 获得 ${prize.prize}\n${eventLog.value}`
}
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

.info {
  margin-top: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.log {
  white-space: pre-line;
  font-family: monospace;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 200px;
  overflow-y: auto;
}
</style> 