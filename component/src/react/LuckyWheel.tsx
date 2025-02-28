import React, { useState, useRef, useCallback } from 'react';
import './LuckyWheel.css';

interface Prize {
  title: string;
  prize: string;
}

interface LuckyWheelProps {
  prizes: Prize[];
  initialDrawCount?: number;
  colors?: string[];
  textColors?: string[];
  additionalTurns?: number;
  messages?: {
    noChance: string;
  };
  onStart?: (data: { prizeIndex: number; drawCount: number }) => void;
  onComplete?: (data: { index: number; prize: Prize }) => void;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({
  prizes,
  initialDrawCount = 3,
  colors = ["#f31f49", "#fff7d7", "#a71d77"],
  textColors = ["#f3f1f1", "#a8213c", "#f3f1f1"],
  additionalTurns = 10,
  messages = {
    noChance: '您没有抽奖机会了'
  },
  onStart,
  onComplete
}) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [drawCount, setDrawCount] = useState(initialDrawCount);
  const lastClickTime = useRef(0);
  const [lastRotation, setLastRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const getPrizeStyle = useCallback((index: number) => {
    const perAngle = 360 / prizes.length;
    const p = perAngle / 2;
    const d = Math.tan(p * Math.PI / 180) * 100;
    const x = (100 - d) / 2;
    
    return {
      transform: `rotateZ(${perAngle/2 - 90 + perAngle * index}deg)`,
      clipPath: `polygon(0% 50%, 100% ${x}%, 100% ${100 - x}%)`
    };
  }, [prizes.length]);

  const startRotation = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current < 1000 || isRotating || drawCount <= 0) {
      return;
    }
    lastClickTime.current = now;

    if (drawCount <= 0) {
      return;
    }

    setIsRotating(true);
    
    // 随机选择奖品
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const perAngle = 360 / prizes.length;
    const targetAngle = prizeIndex * perAngle + perAngle / 2;
    
    // 计算旋转角度
    const additionalRotation = 360 * additionalTurns;  // 额外旋转10圈
    const totalRotation = currentRotation - additionalRotation - targetAngle + lastRotation;

    // 应用旋转动画
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    // 触发开始事件
    onStart?.({ prizeIndex, drawCount: drawCount - 1 });

    // 动画结束后处理
    setTimeout(() => {
      setDrawCount(prev => prev - 1);
      setIsRotating(false);
      setCurrentRotation(totalRotation);
      setLastRotation(targetAngle);
      const prize = prizes[prizeIndex];      
      onComplete?.({ index: prizeIndex, prize });
    }, 5000);
  }, [currentRotation, drawCount, isRotating, prizes, onStart, onComplete, messages]);

  return (
    <div className="lucky-wheel">
      <div className="wheel-box">
        <div id="wheel" ref={wheelRef}>
          <div className="wheel-inner">
            {prizes.map((prize, index) => (
              <div
                key={index}
                className="prize-part"
                style={getPrizeStyle(index)}
              >
                <div 
                  className="prize-bg"
                  style={{ background: colors[index % colors.length] }}
                />
                <div 
                  className="prize-text"
                  style={{ color: textColors[index % textColors.length] }}
                >
                  {prize.prize}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div 
          className={`pointer ${drawCount === 0 ? 'disabled' : ''}`}
          onClick={startRotation} 
        />
      </div>
    </div>
  );
};

export default LuckyWheel; 