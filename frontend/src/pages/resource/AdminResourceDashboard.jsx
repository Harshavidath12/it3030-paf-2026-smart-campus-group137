import React, { useEffect, useState } from 'react';
import { 
  getAllResources, 
  createResource, 
  updateResource, 
  updateResourceStatus, 
  deleteResource 
} from '../../services/resourceService';
import './ResourceDiscoveryPage.css';

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
    location: '',
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
      location: '', status: 'ACTIVE', description: '', metadata: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (res) => {
    setIsEditMode(true);
    setCurrentId(res.id);
    setFormData({
      name: res.name, type: res.type, category: res.category,
      capacity: res.capacity, location: res.location, status: res.status,
      description: res.description || '', metadata: res.metadata || ''
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await updateResourceStatus(id, newStatus);
      fetchResources();
    } catch (err) { console.error(err); }
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
    <div className="discovery-wrapper">
      <header className="header-row">
        <div className="title-area">
          <h1>Campus Inventory</h1>
          <p>Global administrative override for all university facilities and digital assets.</p>
        </div>
        <button className="add-resource-btn" onClick={handleOpenAdd}>
          <span>+</span> Create Resource
        </button>
      </header>

      <div style={{ background: 'white', padding: '40px', borderRadius: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Syncing Database...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f8fafc' }}>
                  <th style={{ padding: '20px', color: 'var(--accent-purple)', fontWeight: '800' }}>ID</th>
                  <th style={{ padding: '20px', color: 'var(--accent-purple)', fontWeight: '800' }}>RESOURCE</th>
                  <th style={{ padding: '20px', color: 'var(--accent-purple)', fontWeight: '800' }}>TYPE</th>
                  <th style={{ padding: '20px', color: 'var(--accent-purple)', fontWeight: '800' }}>STATUS</th>
                  <th style={{ padding: '20px', color: 'var(--accent-purple)', fontWeight: '800' }}>CONTROLS</th>
                </tr>
              </thead>
              <tbody>
                {resources.map(res => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '20px', fontWeight: 'bold', color: '#cbd5e1' }}>#{res.id}</td>
                    <td style={{ padding: '20px', fontWeight: '800', color: 'var(--accent-purple)' }}>{res.name}</td>
                    <td style={{ padding: '20px', color: '#636e72' }}>{res.type}</td>
                    <td style={{ padding: '20px' }}>
                      <span className={`badge-round ${res.status === 'ACTIVE' ? 'badge-active' : 'badge-out'}`} style={{fontSize: '0.7rem'}}>
                        {res.status}
                      </span>
                    </td>
                    <td style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => handleOpenEdit(res)} style={{ background: '#f8fafc', border: '1px solid #eee', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>Edit</button>
                        <button onClick={() => handleToggleStatus(res.id, res.status)} style={{ background: '#fff9db', border: '1px solid #fcc419', color: '#862e9c', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>Toggle</button>
                        <button onClick={() => handleDelete(res.id)} style={{ background: '#fff5f5', border: '1px solid #ff8787', color: '#c92a2a', padding: '10px 15px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee', fontSize: '1.1rem' }} />
              </div>
              <div className="form-field">
                <label>Type</label>
                <input required placeholder="e.g. Laboratory" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Location</label>
                <input required placeholder="Block C" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee', background: '#f8fafc' }}>
                  <option value="FACILITY">Facility</option>
                  <option value="ASSET">Asset</option>
                </select>
              </div>
              <div className="form-field">
                <label>Max Capacity</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} style={{ padding: '15px', borderRadius: '18px', border: '1px solid #eee' }} />
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
