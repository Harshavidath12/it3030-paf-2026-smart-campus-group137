import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources } from '../../services/resourceService';
import { getMe } from '../../services/authService';
import './ResourceDiscoveryPage.css';

const ResourceDiscoveryPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minCapacity: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (e) { /* Guest view */ }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getAllResources(filters);
      setResources(data);
    } catch (err) {
      console.error("Failed to load resources", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getVisualClass = (index) => {
    const classes = ['visual-orange', 'visual-blue', 'visual-purple', 'visual-green'];
    return classes[index % classes.length];
  };

  const getEmoji = (type) => {
    const t = type.toLowerCase();
    if (t.includes('hall') || t.includes('auditorium')) return '🏛️';
    if (t.includes('lab') || t.includes('laboratory')) return '🧪';
    if (t.includes('projector')) return '📽️';
    if (t.includes('laptop')) return '💻';
    if (t.includes('meeting')) return '🤝';
    if (t.includes('tutorial')) return '📖';
    return '🏫';
  };

  return (
    <div className="discovery-wrapper">
      <header className="header-row">
        <div className="title-area">
          <h1>University Facilities</h1>
          <p>Discover best-in-class labs, halls, and specialized equipment. Check availability and coordinate your campus workflow.</p>
        </div>
        
        {user?.role === 'ADMIN' && (
          <button className="add-resource-btn" onClick={() => navigate('/admin/resources')}>
            <span>+</span> Add Resource
          </button>
        )}
      </header>

      <div className="search-bar-row">
        <div style={{ fontSize: '1.5rem' }}>🔍</div>
        <div className="search-input-group">
          <input name="type" placeholder="Search Facility Type" value={filters.type} onChange={handleFilterChange} />
          <input name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
          <input type="number" name="minCapacity" placeholder="Min Capacity" value={filters.minCapacity} onChange={handleFilterChange} />
        </div>
        <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>⚙️</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', margin: '100px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Assets...</p>
      ) : (
        <div className="facilities-grid">
          {resources.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px' }}>
              <h2>Empty Search Results</h2>
              <p>No resources match your current selection.</p>
            </div>
          ) : (
            resources.map((res, index) => (
              <div key={res.id} className="facility-card" onClick={() => navigate(`/resources/${res.id}`)}>
                <div className={`card-visual ${getVisualClass(index)}`}>
                  {getEmoji(res.type)}
                </div>
                <div className="card-info">
                  <h3>{res.name}</h3>
                  <div className="card-meta">
                    <div>📍 {res.location}</div>
                    <div>📁 {res.type}</div>
                    {res.capacity > 0 && <div>👥 {res.capacity} Seats</div>}
                  </div>
                  <div className="status-row">
                    <span className={`badge-round ${res.status === 'ACTIVE' ? 'badge-active' : 'badge-out'}`}>
                       {res.status === 'ACTIVE' ? 'AVAILABLE' : 'MAINTENANCE'}
                    </span>
                    <span style={{ color: '#dfe6e9', fontWeight: 'bold', fontSize: '0.8rem' }}>#0{res.id}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceDiscoveryPage;
