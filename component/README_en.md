# Lucky Wheel Component

[中文文档](./README.md) | English

A well-designed lucky wheel game component built with modern web technologies, providing smooth animations and a complete lottery experience. Supports customizable prize configurations, dynamic wheel style modifications, and is compatible with Vue2/Vue 3 and React.

Ideal for:
- Marketing activities and user engagement
- Membership reward systems
- Game interaction scenarios
- Holiday event lotteries

## Preview

### Animation Effect
![Wheel Animation](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenRecordingAnimation.gif)

### Different Prize Quantity Effects
6 Prize Style:

![6 Prize](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenFor6items.png)

8 Prize Style:

![8 Prize](https://github.com/tinhour/spin-the-wheel/raw/main/screenshot/screenFor8items.png)

## Features

- Smooth wheel animation effects
- Support for customizable prize configurations
- Loading animation hints

## Technical Features

- Supports Vue2/Vue 3 and React
- TypeScript support
- Customizable prizes, colors, and rotation effects
- Responsive design
- Complete event callbacks

## Installation

```bash
npm install lucky-wheel-component
```

## Usage

### Vue Import

```javascript
// Default import Vue version
import { LuckyWheel } from 'lucky-wheel-component';

// Or explicitly specify Vue3 version
import { LuckyWheel } from 'lucky-wheel-component/vue3';
```

### React Import

```javascript
// Import React version
import { LuckyWheel } from 'lucky-wheel-component/react';
```

### Vue 2

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
        { title: 'Congratulations', prize: 'First Prize' },
        { title: 'Congratulations', prize: 'Second Prize' },
        // ...more prizes
      ]
    }
  },
  methods: {
    handleStart({ prizeIndex, drawCount }) {
      console.log('Start drawing', prizeIndex, drawCount)
    },
    handleComplete({ index, prize }) {
      console.log('Drawing complete', index, prize)
    }
  }
})
</script>
```

### Vue 3 Composition API

```vue
<template>
  <LuckyWheel 
    :prizes="prizes"
    :initialDrawCount="3"
    @on-start="handleStart"
    @on-complete="handleComplete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LuckyWheel } from 'lucky-wheel-component/vue3'

const prizes = ref([
  { title: 'Congratulations', prize: 'First Prize' },
  { title: 'Congratulations', prize: 'Second Prize' },
  // ... more prizes
])

const handleStart = ({ prizeIndex, drawCount }) => {
  console.log('Start drawing', prizeIndex, drawCount)
}

const handleComplete = ({ index, prize }) => {
  console.log('Drawing complete', index, prize)
}
</script>
```

### React

```tsx
import React from 'react';
import { LuckyWheel } from 'lucky-wheel-component/react';

const App: React.FC = () => {
  const prizes = [
    { title: 'Congratulations', prize: 'First Prize' },
    { title: 'Congratulations', prize: 'Second Prize' },
    // ...more prizes
  ];

  const handleStart = ({ prizeIndex, drawCount }) => {
    console.log('Start drawing', prizeIndex, drawCount);
  };

  const handleComplete = ({ index, prize }) => {
    console.log('Drawing complete', index, prize);
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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| prizes | Prize[] | [] | List of prizes |
| initialDrawCount | number | 3 | Initial number of draws |
| additionalTurns | number | 10 | Additional rotation turns |
| colors | string[] | ['#f31f49', '#fff7d7', '#a71d77'] | Prize block background colors |
| textColors | string[] | ['#f3f1f1', '#a8213c', '#f3f1f1'] | Prize text colors |

### Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| onStart/on-start | { prizeIndex: number, drawCount: number } | Triggered when drawing starts |
| onComplete/on-complete | { index: number, prize: Prize } | Triggered when drawing completes |

### Prize Type

```typescript
interface Prize {
  title: string;  // Prize title
  prize: string;  // Prize content
}
```

## Development

```bash
# Install dependencies
npm install

# Run Vue example
npm run dev:vue

# Run React example
npm run dev:react

# Build
npm run build
```

## License

MIT

## Links

- [GitHub Repository](https://github.com/tinhour/spin-the-wheel/blob/main/component/)
- [Bug Report](https://github.com/tinhour/spin-the-wheel/issues)
- [npm Package](https://www.npmjs.com/package/lucky-wheel-component)
