import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResources, createResource } from '../../services/resourceService';
import { getMe, logout } from '../../services/authService';
import NotificationBell from '../../components/NotificationBell';
import GlobalNavbar from '../../components/GlobalNavbar';
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
    minCapacity: '',
    status: ''
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Lecture Hall',
    category: 'FACILITY',
    capacity: 0,
    building: 'Main Building',
    floor: '',
    roomNumber: '',
    status: 'ACTIVE',
    description: '',
    metadata: ''
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      await createResource(formData);
      setShowModal(false);
      fetchResources();
      setFormData({
        name: '', type: 'Lecture Hall', category: 'FACILITY', capacity: 0,
        building: 'Main Building', floor: '', roomNumber: '', status: 'ACTIVE', description: '', metadata: ''
      });
    } catch (err) {
      console.error("Failed to create resource", err);
    }
  };

  const getVisualClass = (index) => {
    const classes = ['visual-orange', 'visual-blue', 'visual-purple', 'visual-green'];
    return classes[index % classes.length];
  };

  const getEmoji = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('hall') || t.includes('auditorium')) return '🏛️';
    if (t.includes('lab') || t.includes('laboratory')) return '🧪';
    if (t.includes('projector') || t.includes('equipment') || t.includes('camera')) return '📷';
    if (t.includes('meeting')) return '🤝';
    if (t.includes('tutorial')) return '📖';
    return '🏫';
  };

  return (
    <div className="app-container">
      {/* Circular Floating Add Button for Admins */}
      {user?.role === 'ADMIN' && (
        <button 
          className="premium-add-btn"
          style={{ position: 'absolute', top: '120px', right: '60px', zIndex: 10 }}
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      )}

      {/* Standard App Navbar Component */}
      <GlobalNavbar customUser={user} />

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        <header className="page-header">
          <div className="title-content">
            <h1>Resource Hub</h1>
            <p>Find the right space or equipment for your needs, anytime on campus.</p>
          </div>

          {/* Moved to Navbar */}
        </header>

        <div className="smart-search-zone">
          <div className="search-input-box">
            <span className="search-box-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input 
              name="type" 
              placeholder="Search specific rooms (e.g. Lab 401)" 
              value={filters.type} 
              onChange={handleFilterChange} 
            />
          </div>
          <div className="fast-filters">
            <select name="type" className="premium-select" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types </option>
              <option value="Lecture Hall">Lecture Hall</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Projector Room">Projector Room</option>
            </select>
            <select name="minCapacity" className="premium-select" value={filters.minCapacity} onChange={handleFilterChange}>
              <option value="">Any Capacity </option>
              <option value="30">30+ Seats</option>
              <option value="50">50+ Seats</option>
              <option value="100">100+ Seats</option>
            </select>
            <select name="building" className="premium-select" value={filters.building} onChange={handleFilterChange}>
              <option value="">Any Building </option>
              <option value="Main Building">Main Building</option>
              <option value="New Building">New Building</option>
            </select>
            <select name="status" className="premium-select" value={filters.status} onChange={handleFilterChange}>
              <option value="">Any Status </option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>
            <button className="reset-btn" onClick={() => setFilters({type:'', building:'', floor:'', minCapacity:'', status:''})}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>
              </svg>
            </button>
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
                <button className="reset-action" onClick={() => setFilters({ type: '', building: '', floor: '', minCapacity: '' })}>Clear All Filters</button>
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
                        <span className="row-label">Building:</span>
                        <span className="row-value">{res.building}</span>
                      </div>
                      <div className="info-row">
                        <span className="row-label">Floor:</span>
                        <span className="row-value">{res.floor}</span>
                      </div>
                      <div className="info-row">
                        <span className="row-label">Room:</span>
                        <span className="row-value">{res.roomNumber}</span>
                      </div>
                      {res.capacity > 0 && (
                        <div className="info-row">
                          <span className="row-label">Capacity:</span>
                          <span className="row-value">{res.capacity} Seats</span>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <span className={`status-pill ${res.status === 'ACTIVE' ? 'available' : 'out-of-service'}`}>
                        {res.status === 'ACTIVE' ? '🟢 AVAILABLE' : '🛑 OUT OF SERVICE'}
                      </span>
                      {res.status === 'ACTIVE' && (
                        <button
                          className="quick-book-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/book?resourceId=${res.id}`);
                          }}
                        >
                          Book Now
                        </button>
                      )}
                      <span className="resource-id">#ID-{res.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="premium-modal">
            <div className="modal-header">
              <h2>Register New Resource</h2>
              <p>Add a new facility or equipment to the campus catalogue.</p>
            </div>

            <form onSubmit={handleCreateResource} className="modal-form">
              <div className="form-group full">
                <label>Resource Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Innovation Lab 01"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Projector Room">Projector Room</option>
                    <option value="Library">Library</option>
                    <option value="Laboratory">Laboratory</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Building</label>
                  <select value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })}>
                    <option value="Main Building">Main Building</option>
                    <option value="New Building">New Building</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Floor</label>
                  <input
                    required
                    value={formData.floor}
                    onChange={e => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="e.g. Level 3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Number</label>
                  <input
                    required
                    value={formData.roomNumber}
                    onChange={e => setFormData({ ...formData, roomNumber: e.target.value })}
                    placeholder="e.g. A301"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                  </select>
                </div>
              </div>

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe this resource..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Discard</button>
                <button type="submit" className="btn-submit">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceDiscoveryPage;
