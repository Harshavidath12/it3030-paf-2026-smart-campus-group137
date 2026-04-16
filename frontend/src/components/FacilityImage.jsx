import React, { useState } from 'react';

const FacilityImage = ({ res, fallbackEmoji, bgClass, height = '250px' }) => {
  const [error, setError] = useState(false);
  
  // Look for specifically named images first, then fallback to a formatted name or ID
  const lowerName = (res.name || '').toLowerCase();
  const roomNum = (res.roomNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  let fileName = `${res.id}.jpg`; // default
  
  if (lowerName.includes('meeting room 1')) fileName = 'meeting1.jpg';
  else if (lowerName.includes('meeting room 2')) fileName = 'meeting2.jpg';
  else if (lowerName.includes('library')) fileName = 'library.jpg';
  else if (lowerName.includes('auditorium')) fileName = 'auditorium.jpg';
  else if (lowerName.includes('mac lab')) fileName = 'maclab.jpg';
  else if (roomNum) fileName = `${roomNum}.jpg`;
  else if (lowerName.includes('hall') || lowerName.includes('lecture')) fileName = 'hall.jpg';
  else if (lowerName.includes('lab')) fileName = 'maclab.jpg'; 
  else if (lowerName.includes('projector')) fileName = 'projector.jpg';
  else if (lowerName.includes('boardroom') || lowerName.includes('room')) fileName = 'room.jpg';
  else fileName = `${lowerName.replace(/[^a-z0-9]/g, '-')}.jpg`;

  const imageUrl = `/facilities/${fileName}`;

  if (error) {
    return (
      <div className={`card-visual ${bgClass || ''}`} style={{
        background: '#f8fafc', 
        borderRadius: '30px 30px 0 0',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontSize: '8rem', 
        height: height
      }}>
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className={`card-visual ${bgClass || ''}`} style={{
      background: '#f8fafc',
      borderRadius: '30px 30px 0 0', 
      height: height, 
      overflow: 'hidden',
      padding: 0
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
