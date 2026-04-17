import React, { useEffect, useState } from 'react';
import {
  getAllResources,
  createResource,
  updateResource,
  updateResourceStatus,
  deleteResource
} from '../../services/resourceService';
import './ResourceDiscoveryPage.css';

import FacilityImage from '../../components/FacilityImage';
const AdminResourceDashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: 'FACILITY',
    capacity: 0,
    building: '',
    floor: '',
    roomNumber: '',
    status: 'ACTIVE',
    description: '',
    metadata: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({
      name: '', type: '', category: 'FACILITY', capacity: 0,
      building: '', floor: '', roomNumber: '', status: 'ACTIVE', description: '', metadata: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (res) => {
    setIsEditMode(true);
    setCurrentId(res.id);
    setFormData({
      name: res.name, type: res.type, category: res.category,
      capacity: res.capacity, building: res.building, floor: res.floor, roomNumber: res.roomNumber, status: res.status,
      description: res.description || '', metadata: res.metadata || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        alert('Resource deleted successfully!');
        fetchResources();
      } catch (err) { 
        console.error(err); 
        alert(err.response?.data?.message || 'Failed to delete resource.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditMode) {
        await updateResource(currentId, formData);
        alert('Resource updated successfully!');
      } else {
        await createResource(formData);
        alert('New resource registered successfully!');
      }
      setShowModal(false);
      fetchResources();
    } catch (err) { 
      console.error(err); 
      alert(err.response?.data?.message || 'Failed to save resource. Please check if you are logged in as admin.');
    } finally {
      setSaving(false);
    }
  };

  const modalStyles = {
    overlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(30, 27, 75, 0.4)', backdropFilter: 'blur(12px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      padding: '20px'
    },
    container: {
      background: 'white', padding: '60px 70px', borderRadius: '60px',
      width: '90%', maxWidth: '850px', boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
      position: 'relative', overflow: 'hidden'
    },
    title: { 
      marginBottom: '40px', fontSize: '2.8rem', fontWeight: '900', 
      color: '#1e1b4b', letterSpacing: '-1.2px', textAlign: 'left' 
    },
    formGrid: { 
      display: 'grid', gridTemplateColumns: '1fr 1fr', 
      columnGap: '40px', rowGap: '20px' 
    },
    fieldRow: { display: 'flex', alignItems: 'center', gap: '12px', width: '100%', overflow: 'hidden' },
    label: { 
      width: '110px', fontSize: '0.9rem', fontWeight: '700', 
      color: '#475569', whiteSpace: 'nowrap', flexShrink: 0
    },
    input: {
      flex: 1, padding: '14px 20px', borderRadius: '999px',
      border: '1px solid #f1f5f9', background: '#f8fafc',
      fontSize: '0.95rem', outline: 'none', color: '#1e1b4b',
      fontWeight: '600', transition: 'all 0.3s', minWidth: 0
    },
    submitBtn: {
      flex: 1, padding: '20px', borderRadius: '15px', border: 'none',
      background: '#007bff', color: 'white', fontWeight: '800', 
      cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(0,123,255,0.2)',
      transition: 'all 0.3s'
    },
    discardBtn: {
      flex: 1, padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9',
      background: 'white', color: '#64748b', fontWeight: '800', 
      cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s'
    }
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ position: 'relative' }}>
      <div style={{ padding: '0 40px 30px' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '8px', fontWeight: '500' }}>
          Smart Campus / Admin Console
        </p>
        <h1 style={{ color: '#1e1b4b', fontSize: '2.8rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>
          Resource Catalogue
        </h1>
      </div>

      <button className="premium-add-btn" style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 10 }} onClick={handleOpenAdd}>+</button>

      <div className="smart-search-zone">
        <div className="search-input-box">
          <span className="search-box-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="fast-filters">
          <select className="premium-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Computer Lab">Computer Lab</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Projector Room">Projector Room</option>
          </select>
          <select className="premium-select" value={buildingFilter} onChange={(e) => setBuildingFilter(e.target.value)}>
            <option value="">Any Building</option>
            <option value="Main Building">Main Building</option>
            <option value="New Building">New Building</option>
          </select>
          <button className="reset-btn" onClick={() => { setSearchTerm(''); setTypeFilter(''); setBuildingFilter(''); fetchResources(); }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="admin-cards-grid">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px', width: '100%' }}>Syncing Database...</p>
        ) : (
          resources
            .filter(res => 
              res.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (typeFilter === '' || res.type === typeFilter) &&
              (buildingFilter === '' || res.building === buildingFilter)
            )
            .map(res => (
            <div className="admin-card" key={res.id}>
              <div className="admin-card-top">
                <div className="admin-title-area">
                  <h3>{res.name}</h3>
                  <p>{res.type}</p>
                </div>
                <div className={`admin-badge badge-${res.status.toLowerCase().replace(/_/g, '-')}`}>
                  {res.status.replace(/_/g, ' ')}
                </div>
              </div>

              <FacilityImage res={res} />

              <div className="admin-card-bottom">
                <div className="admin-meta-info">
                  <span>👥 {res.capacity || 'N/A'}</span>
                  <span>📍 {res.building}, {res.floor} - {res.roomNumber}</span>
                </div>
                <div className="admin-actions">
                  <button className="base-btn btn-edit" onClick={() => handleOpenEdit(res)}>✏️ Edit</button>
                  <button className="base-btn btn-delete" onClick={() => handleDelete(res.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.container}>
            <h2 style={modalStyles.title}>
              {isEditMode ? 'Update Facility' : 'Register New Resource'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={modalStyles.formGrid}>
                {/* Resource Name - Full Width Row */}
                <div style={{ gridColumn: '1 / -1', ...modalStyles.fieldRow }}>
                  <label style={modalStyles.label}>Resource Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={modalStyles.input} />
                </div>
                
                {/* Second Row */}
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Type</label>
                  <input required placeholder="e.g. Laboratory" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={modalStyles.input} />
                </div>
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Building</label>
                  <input required placeholder="Block C" value={formData.building || ''} onChange={e => setFormData({ ...formData, building: e.target.value })} style={modalStyles.input} />
                </div>

                {/* Third Row */}
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Floor</label>
                  <input required placeholder="2nd Floor" value={formData.floor || ''} onChange={e => setFormData({ ...formData, floor: e.target.value })} style={modalStyles.input} />
                </div>
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Room Number</label>
                  <input required placeholder="Lab 301" value={formData.roomNumber || ''} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} style={modalStyles.input} />
                </div>

                {/* Fourth Row */}
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={modalStyles.input}>
                    <option value="FACILITY">Facility</option>
                    <option value="ASSET">Asset</option>
                  </select>
                </div>
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Max Capacity</label>
                  <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} style={modalStyles.input} />
                </div>

                {/* Fifth Row */}
                <div style={modalStyles.fieldRow}>
                  <label style={modalStyles.label}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={modalStyles.input}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '30px', marginTop: '60px' }}>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{
                    ...modalStyles.submitBtn,
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }} 
                  onMouseOver={e => !saving && (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseOut={e => !saving && (e.currentTarget.style.transform = 'translateY(0)')}>
                  {saving ? 'Processing...' : 'Save Entry'}
                </button>
                <button 
                  type="button" 
                  disabled={saving}
                  onClick={() => setShowModal(false)} 
                  style={{
                    ...modalStyles.discardBtn,
                    opacity: saving ? 0.5 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                  onMouseOver={e => !saving && (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseOut={e => !saving && (e.currentTarget.style.transform = 'translateY(0)')}>
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourceDashboard;
