import React from 'react';
import './statistics.css';

function Statistics({ statistics }) {
  if (!statistics) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="statistics-container">
      <h2>Mountain Statistics</h2>
      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Anzahl der Berge über Schwellenwert</h3>
          <p>{statistics.mountainsAboveThreshold}</p>
        </div>
        <div className="stat-card">
          <h3>Höchster Berg</h3>
          <p>{statistics.highestMountain ? 
            `${statistics.highestMountain.name}; ${statistics.highestMountain.elevation}m` : 
            'Keine Daten verfügbar'}</p>
        </div>
        <div className="stat-card">
          <h3>Nächster Berg zum Nordpol</h3>
          <p>{statistics.northernmostMountain ? 
            `${statistics.northernmostMountain.name}; ${statistics.northernmostMountain.latitude}` : 
            'Keine Daten verfügbar'}</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;