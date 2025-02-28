# Lucky Wheel Component

A simple and easy-to-use lucky wheel component that supports both Vue 3 and React.

[中文文档](./README.md)

## Features

- Support for Vue 3 and React
- TypeScript support
- Customizable prizes, colors, and rotation effects
- Responsive design
- Complete event callbacks

## Installation

```bash
npm install lucky-wheel-component
```

## Usage

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
        { title: 'Congratulations', prize: 'First Prize' },
        { title: 'Congratulations', prize: 'Second Prize' },
        // ... more prizes
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

### React

```tsx
import React from 'react';
import { LuckyWheel } from 'lucky-wheel-component';

const App: React.FC = () => {
  const prizes = [
    { title: 'Congratulations', prize: 'First Prize' },
    { title: 'Congratulations', prize: 'Second Prize' },
    // ... more prizes
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
| messages | object | { noChance: 'No more chances' } | Message configurations |

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