# 抽奖转盘游戏组件

[English](./README_en.md) | 简体中文

一个精心设计的幸运转盘抽奖游戏，基于现代 Web 技术构建，提供流畅的动画效果和完整的抽奖体验。支持自定义奖品配置、动态修改转盘样式，支持 Vue 3 和 React。

特别适合:
- 营销活动和用户促活
- 会员奖励系统
- 游戏互动场景
- 节日活动抽奖

## 预览

### 动画效果
![转盘动画](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenRecordingAnimation.gif)

### 不同奖品数量效果
6个奖品样式：

![6个奖品](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenFor6items.png)

8个奖品样式：

![8个奖品](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenFor8items.png)

## 功能特点

- 流畅的转盘动画效果
- 支持自定义奖品配置
- 加载动画提示
 
 ## 技术特性
 
 - 支持 Vue 3 和 React
 - TypeScript 支持
 - 可自定义奖品、颜色和旋转效果
 - 响应式设计
 - 完整的事件回调
 
 ## 安装
 
 ```bash
 npm install lucky-wheel-component
 ```
 
 ## 使用方法
 
 ## 安装

```bash
npm install lucky-wheel-component
```

## 使用方法

### Vue  引入

```javascript
// 默认导入 Vue 版本
import { LuckyWheel } from 'lucky-wheel-component';

// 或明确指定 Vue 版本
import { LuckyWheel } from 'lucky-wheel-component/vue';
```

### React引入

```javascript
// 导入 React 版本
import { LuckyWheel } from 'lucky-wheel-component/react';
```
```

 ### Vue 3
 
 ```vue
 <template>
   <LuckyWheel 
     :prizes="prizes"
     :initialDrawCount="3"
     :additionalTurns="10"
     @on-start="handleStart"
     @on-complete="handleComplete"
   />
 </template>
 
 <script lang="ts">
 import { defineComponent } from 'vue'
 import { LuckyWheel } from 'lucky-wheel-component'
 
 export default defineComponent({
   components: {
     LuckyWheel
   },
   data() {
     return {
       prizes: [
         { title: '恭喜获得', prize: '一等奖' },
         { title: '恭喜获得', prize: '二等奖' },
         // ...更多奖品
       ]
     }
   },
   methods: {
     handleStart({ prizeIndex, drawCount }) {
       console.log('开始抽奖', prizeIndex, drawCount)
     },
     handleComplete({ index, prize }) {
       console.log('抽奖完成', index, prize)
     }
   }
 })
 </script>
 ```
 
 ### React
 
 ```tsx
 import React from 'react';
 import { LuckyWheel } from 'lucky-wheel-component';
 
 const App: React.FC = () => {
   const prizes = [
     { title: '恭喜获得', prize: '一等奖' },
     { title: '恭喜获得', prize: '二等奖' },
     // ...更多奖品
   ];
 
   const handleStart = ({ prizeIndex, drawCount }) => {
     console.log('开始抽奖', prizeIndex, drawCount);
   };
 
   const handleComplete = ({ index, prize }) => {
     console.log('抽奖完成', index, prize);
   };
 
   return (
     <LuckyWheel 
       prizes={prizes}
       initialDrawCount={3}
       additionalTurns={10}
       onStart={handleStart}
       onComplete={handleComplete}
     />
   );
 };
 ```
 
 ## API
 
 ### Props
 
 | 属性 | 类型 | 默认值 | 说明 |
 |------|------|--------|------|
 | prizes | Prize[] | [] | 奖品列表 |
 | initialDrawCount | number | 3 | 初始抽奖次数 |
 | additionalTurns | number | 10 | 额外旋转圈数 |
 | colors | string[] | ['#f31f49', '#fff7d7', '#a71d77'] | 奖品区块背景色 |
 | textColors | string[] | ['#f3f1f1', '#a8213c', '#f3f1f1'] | 奖品文字颜色 |
 
 ### Events
 
 | 事件名 | 参数 | 说明 |
 |--------|------|------|
 | onStart/on-start | { prizeIndex: number, drawCount: number } | 开始抽奖时触发 |
 | onComplete/on-complete | { index: number, prize: Prize } | 抽奖完成时触发 |
 
 ### Prize 类型
 
 ```typescript
 interface Prize {
   title: string;  // 奖品标题
   prize: string;  // 奖品内容
 }
 ```
 
 ## 开发
 
 ```bash
 # 安装依赖
 npm install
 
 # 运行 Vue 示例
 npm run dev:vue
 
 # 运行 React 示例
 npm run dev:react
 
 # 构建
 npm run build
 ```
 
 ## License
 
 MIT
