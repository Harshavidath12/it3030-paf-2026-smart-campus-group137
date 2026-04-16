import React, { useState } from 'react';

const FacilityImage = ({ res, fallbackEmoji, bgClass }) => {
  const [error, setError] = useState(false);
  
  // Look for specifically named images first, then fallback to a formatted name or ID
  const lowerName = (res.name || '').toLowerCase();
  let fileName = `${res.id}.jpg`; // default
  
  if (lowerName.includes('auditorium')) fileName = 'auditorium.jpg';
  else if (lowerName.includes('hall') || lowerName.includes('lecture')) fileName = 'hall.jpg';
  else if (lowerName.includes('lab')) fileName = 'maclab.jpg'; // Match the user's edit
  else if (lowerName.includes('projector')) fileName = 'projector.jpg';
  else if (lowerName.includes('boardroom') || lowerName.includes('room')) fileName = 'room.jpg';
  else fileName = `${lowerName.replace(/[^a-z0-9]/g, '-')}.jpg`;

  const imageUrl = `/facilities/${fileName}`;

  if (error) {
    return (
      <div className={`card-visual ${bgClass || ''}`} style={bgClass ? {} : {
        background: '#f8fafc', borderRadius: '30px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '12rem', height: '400px'
      }}>
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className={`card-visual ${bgClass || ''}`} style={bgClass ? { padding: 0 } : {
      background: '#f8fafc', borderRadius: '30px', height: '400px', overflow: 'hidden'
    }}>
      <img
        src={imageUrl}
        alt={res.name}
        onError={() => setError(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};

export default FacilityImage;
