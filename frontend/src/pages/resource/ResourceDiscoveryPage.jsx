import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources } from '../../services/resourceService';
import { getMe } from '../../services/authService';
import FacilityImage from '../../components/FacilityImage';
import './ResourceDiscoveryPage.css';

const ResourceDiscoveryPage = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    type: '',
    building: '',
    floor: '',
    minCapacity: ''
  });

  const [activeSidebar, setActiveSidebar] = useState('All');

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

  const handleSidebarClick = (building) => {
    setActiveSidebar(building);
    setFilters(prev => ({ ...prev, building: building === 'All' ? '' : building }));
  };

  const getVisualClass = (index) => {
    const classes = ['visual-orange', 'visual-blue', 'visual-purple', 'visual-green'];
    return classes[index % classes.length];
  };

  const getEmoji = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('hall') || t.includes('auditorium')) return '🏛️';
    if (t.includes('lab') || t.includes('laboratory')) return '🧪';
    if (t.includes('projector')) return '📽️';
    if (t.includes('laptop')) return '💻';
    if (t.includes('meeting')) return '🤝';
    if (t.includes('tutorial')) return '📖';
    return '🏫';
  };

  return (
    <div className="app-container">
      {/* Premium Sidebar Component */}
      <aside className="campus-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">CS</div>
          <h2>CAMPUS RESOURCE</h2>
        </div>
        <nav className="sidebar-menu">
          <div className="menu-label">Navigation</div>
          <button 
            className={`menu-item ${activeSidebar === 'All' ? 'active' : ''}`}
            onClick={() => handleSidebarClick('All')}
          >
            <span className="item-icon">🏫</span>
            All Resources
          </button>
          
          <div className="menu-label">Buildings</div>
          <button 
            className={`menu-item ${activeSidebar === 'Main Building' ? 'active' : ''}`}
            onClick={() => handleSidebarClick('Main Building')}
          >
            <span className="item-icon">🏛️</span>
            Main Building
          </button>
          <button 
            className={`menu-item ${activeSidebar === 'New Building' ? 'active' : ''}`}
            onClick={() => handleSidebarClick('New Building')}
          >
            <span className="item-icon">🏗️</span>
            New Building
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        <header className="page-header">
          <div className="title-content">
            <h1>Discovery Hub</h1>
            <p>Managing {resources.length}+ high-fidelity facilities across his campus.</p>
          </div>
          
          {user?.role === 'ADMIN' && (
            <button className="premium-add-btn" onClick={() => navigate('/admin/resources')}>
              <span>+</span> Register New
            </button>
          )}
        </header>

        <div className="smart-search-zone">
          <div className="search-input-box">
            <span className="search-box-icon">🔍</span>
            <input 
              name="type" 
              placeholder="Search specific rooms (e.g. Lab 401)" 
              value={filters.type} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="fast-filters">
            <select name="type" className="premium-select" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Meeting Room">Meeting Room</option>
            </select>
            <select name="floor" className="premium-select" value={filters.floor} onChange={handleFilterChange}>
              <option value="">Any Floor</option>
              <option value="Basement">Basement</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="3rd Floor">3rd Floor</option>
              <option value="4th Floor">4th Floor</option>
            </select>
            <button className="reset-btn" onClick={() => setFilters({type:'', building:'', floor:'', minCapacity:''})}>🔄</button>
          </div>
        </div>

        {loading ? (
          <div className="loader-box">
            <div className="pulse-loader"></div>
            <p>Syncing Infrastructure...</p>
          </div>
        ) : (
          <div className="resources-grid">
            {resources.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📂</div>
                <h2>Zero Results Found</h2>
                <p>We couldn't find any resources matching those specific criteria.</p>
                <button className="reset-action" onClick={() => setFilters({type:'', building:'', floor:'', minCapacity:''})}>Clear All Filters</button>
              </div>
            ) : (
              resources.map((res, index) => (
                <div key={res.id} className="resource-premium-card" onClick={() => navigate(`/resources/${res.id}`)}>
                  <FacilityImage 
                    res={res} 
                    fallbackEmoji={getEmoji(res.type)} 
                    bgClass={getVisualClass(index)} 
                  />
                  <div className="card-body">
                    <h3>{res.name}</h3>
                    <div className="info-rows">
                      <div className="info-row">
                        <span className="row-label">🏢 Building:</span>
                        <span className="row-value">{res.building}</span>
                      </div>
                      <div className="info-row">
                        <span className="row-label">🧱 Floor:</span>
                        <span className="row-value">{res.floor}</span>
                      </div>
                      <div className="info-row">
                        <span className="row-label">🔖 Room:</span>
                        <span className="row-value">{res.roomNumber}</span>
                      </div>
                      {res.capacity > 0 && (
                        <div className="info-row">
                          <span className="row-label">👥 Capacity:</span>
                          <span className="row-value">{res.capacity} Seats</span>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <span className={`status-pill ${res.status === 'ACTIVE' ? 'available' : 'booked'}`}>
                         {res.status === 'ACTIVE' ? '🟢 AVAILABLE' : '🔴 BOOKED'}
                      </span>
                      <span className="resource-id">#ID-{res.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResourceDiscoveryPage;
