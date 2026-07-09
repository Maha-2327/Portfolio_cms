import React, { useEffect, useState } from 'react';

// Animated counter for the dashboard stat cards
const StatCard = ({ label, value, icon }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) return;
    const duration = 800;
    const stepTime = Math.max(Math.floor(duration / end), 20);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
