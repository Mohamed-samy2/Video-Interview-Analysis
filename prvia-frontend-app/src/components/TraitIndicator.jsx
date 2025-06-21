import React from 'react';
import '../styles/TraitIndicator.css'; // Ensure you have this CSS file for styling

const TraitIndicator = ({ traitName, isPositive, positiveLabel, negativeLabel, description }) => {
  return (
    <div className="trait-indicator">
      <h6 className="trait-title">{traitName}</h6>
      <p className="trait-description">{description}</p>
      <div className="oval-bar-container">
        <div className={`oval ${isPositive ? 'active-positive' : 'inactive'}`}></div>
        <div className={`oval ${!isPositive ? 'active-negative' : 'inactive'}`}></div>
      </div>
      <div className="oval-labels">
        <span>{positiveLabel}</span>
        <span>{negativeLabel}</span>
      </div>
    </div>
  );
};

export default TraitIndicator;
