import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResourceById } from '../../services/resourceService';
import './ResourceDiscoveryPage.css';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRes = async () => {
      try {
        const data = await getResourceById(id);
        setResource(data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRes();
  }, [id]);

  if (loading) return (
    <div className="discovery-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Fetching Details...</h1>
    </div>
  );

  if (!resource) return (
    <div className="discovery-wrapper" style={{ textAlign: 'center' }}>
      <h1>Resource not found</h1>
      <button className="add-resource-btn" style={{ margin: '20px auto' }} onClick={() => navigate('/resources')}>Return to Hub</button>
    </div>
  );

  const getEmoji = (type) => {
    const t = type.toLowerCase();
    if (t.includes('hall') || t.includes('auditorium')) return '🏛️';
    if (t.includes('lab') || t.includes('laboratory')) return '🧪';
    if (t.includes('projector')) return '📽️';
    if (t.includes('laptop')) return '💻';
    return '🏫';
  };

  return (
    <div className="discovery-wrapper">
      <button 
        onClick={() => navigate(-1)}
        style={{
          background: 'none', border: '1px solid #eee', 
          padding: '12px 24px', borderRadius: '15px', cursor: 'pointer',
          marginBottom: '30px', fontWeight: '800', color: 'var(--accent-purple)'
        }}
      >
        ← Back
      </button>

      <div style={{
        background: 'white', padding: '60px', borderRadius: '40px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.01)',
        display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '60px'
      }}>
        <div style={{
          background: '#f8fafc', borderRadius: '30px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '12rem', height: '400px'
        }}>
           {getEmoji(resource.type)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className={`badge-round ${resource.status === 'ACTIVE' ? 'badge-active' : 'badge-out'}`} style={{width: 'fit-content'}}>
            {resource.status}
          </span>
          <h1 style={{fontSize: '4.5rem', margin: '20px 0', fontWeight: '800', color: 'var(--accent-purple)', letterSpacing: '-3px'}}>{resource.name}</h1>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', color: '#636e72', fontSize: '1.2rem', marginBottom: '40px'}}>
            <div>🏢 <strong>Location:</strong><br/>{resource.location}</div>
            <div>📁 <strong>Type:</strong><br/>{resource.type}</div>
            <div>👥 <strong>Capacity:</strong><br/>{resource.capacity} Seats</div>
            <div>🏷️ <strong>Category:</strong><br/>{resource.category}</div>
          </div>

          <div style={{borderTop: '1px solid #f1f5f9', paddingTop: '30px'}}>
             <h3 style={{color: 'var(--accent-purple)', marginBottom: '15px', fontSize: '1.6rem'}}>Property Description</h3>
             <p style={{lineHeight: '2', color: '#636e72', fontSize: '1.1rem'}}>
               {resource.description || "Detailed facility profile is still being populated by the campus administration."}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
