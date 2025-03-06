import React, { useState } from 'react';
import LuckyWheel from '../../src/react/LuckyWheel';
import './App.css';

const App: React.FC = () => {
  const [eventLog, setEventLog] = useState('');
  
  const prizes = [
    { title: '恭喜获得', prize: '一等奖' },
    { title: '恭喜获得', prize: '二等奖' },
    { title: '恭喜获得', prize: '三等奖' },
    { title: '下次再来', prize: '谢谢惠顾' },
    { title: '恭喜获得', prize: '四等奖' },
    { title: '恭喜获得', prize: '五等奖' },
    { title: '恭喜获得', prize: '六等奖' },
    { title: '再来一次', prize: '谢谢惠顾' }
  ];

  const handleStart = ({ prizeIndex, drawCount }: { prizeIndex: number; drawCount: number }) => {
    setEventLog(prev => 
      `开始抽奖: 奖品索引 ${prizeIndex}, 剩余次数 ${drawCount}\n${prev}`
    );
  };

  const handleComplete = ({ prize }: { prize: { title: string; prize: string } }) => {
    setEventLog(prev => 
      `抽奖完成: 获得 ${prize.prize}\n${prev}`
    );
  };

  return (
    <div className="app">
      <h1>Lucky Wheel React Demo</h1>
      <LuckyWheel 
        prizes={prizes}
        initialDrawCount={3}
         messages={{
             noChance: 'No more chances'
           }}
        onStart={handleStart}
        onComplete={handleComplete}
      />
      <div className="info">
        <h2>Events Log:</h2>
        <div className="log">{eventLog}</div>
      </div>
    </div>
  );
};

export default App; 