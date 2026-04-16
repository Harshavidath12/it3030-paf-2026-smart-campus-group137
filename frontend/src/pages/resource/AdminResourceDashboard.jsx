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
        fetchResources();
      } catch (err) { console.error(err); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateResource(currentId, formData);
      } else {
        await createResource(formData);
      }
      setShowModal(false);
      fetchResources();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="admin-dashboard-wrapper" style={{ position: 'relative' }}>
      <header className="header-row">
        <div className="title-area">
          <h1>RESOURCE CATALOGUE</h1>
        </div>
      </header>

      <button className="add-resource-btn-floating" onClick={handleOpenAdd}>+</button>

      <div className="admin-search-bar">
        <div className="admin-search-input">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search resources..." defaultValue="" />
        </div>
        <select className="admin-filter"><option>Type</option></select>
        <select className="admin-filter"><option>Building</option></select>
        <select className="admin-filter"><option>Floor</option></select>
      </div>

      <div className="admin-cards-grid">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px', width: '100%' }}>Syncing Database...</p>
        ) : (
          resources.map(res => (
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
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(30, 27, 75, 0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '60px', borderRadius: '40px',
            width: '100%', maxWidth: '600px', boxShadow: '0 40px 120px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginBottom: '30px', fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-purple)', letterSpacing: '-2px' }}>
              {isEditMode ? 'Update Facility' : 'Register New Resource'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div style={{ gridColumn: '1 / -1' }} className="form-field">
                <label>Resource Name</label>
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee', fontSize: '1.1rem' }} />
              </div>
              <div className="form-field">
                <label>Type</label>
                <input required placeholder="e.g. Laboratory" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Building</label>
                <input required placeholder="Block C" value={formData.building || ''} onChange={e => setFormData({ ...formData, building: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Floor</label>
                <input required placeholder="2nd Floor" value={formData.floor || ''} onChange={e => setFormData({ ...formData, floor: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Room Number</label>
                <input required placeholder="Lab 301" value={formData.roomNumber || ''} onChange={e => setFormData({ ...formData, roomNumber: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee', background: '#f8fafc' }}>
                  <option value="FACILITY">Facility</option>
                  <option value="ASSET">Asset</option>
                </select>
              </div>
              <div className="form-field">
                <label>Max Capacity</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px', marginTop: '30px' }}>
                <button type="submit" className="add-resource-btn" style={{ flex: 1, justifyContent: 'center' }}>Save Entry</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #eee', background: 'none', padding: '15px', borderRadius: '20px', cursor: 'pointer', fontWeight: '800', color: '#636e72' }}>Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResourceDashboard;
