// Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Effect to handle countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  // Determine color based on remaining time
  const getColor = () => {
    if (timeLeft > duration * 0.66) return '#4CAF50'; // Green
    if (timeLeft > duration * 0.33) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 60,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid ' + getColor(),
      zIndex: 1000
    }}>
      {/* Rotating indicator to show the remaining time */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '50%',
        height: '3px',
        backgroundColor: getColor(),
        transformOrigin: '0% 50%',
        transform: `rotate(${360 * (timeLeft / duration) - 90}deg)`,
        transition: 'transform 1s linear'
      }} />
    </div>
  );
};

export default Timer;
