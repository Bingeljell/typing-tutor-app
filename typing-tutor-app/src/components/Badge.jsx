// src/components/Badge.jsx

const Badge = ({ accuracy }) => {
    let label = '';
    let emoji = '';
    let color = '';
  
    if (accuracy >= 95) {
      label = 'Gold';
      emoji = '🥇';
      color = 'gold';
    } else if (accuracy >= 75) {
      label = 'Silver';
      emoji = '🥈';
      color = 'silver';
    } else if (accuracy >= 50) {
      label = 'Bronze';
      emoji = '🥉';
      color = '#cd7f32';
    } else {
      return null; // No badge if below 50%
    }
  
    return (
      <div style={{ fontSize: '24px', marginTop: '10px', color }}>
        {emoji} {label} Badge Earned!
      </div>
    );
  };
  
  export default Badge;
  