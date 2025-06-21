import React from 'react';
import '../styles/ScoreBar.css'; // Ensure you have this CSS file for styling

const ScoreBar = ({ label, value }) => {
  const percentage = Math.min(100, Math.max(0, (value / 10) * 100));

  return (
    <div className="score-bar-container">
      <div className="score-bar-label">
        <strong>{label}:</strong> {value}/10
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default ScoreBar;
