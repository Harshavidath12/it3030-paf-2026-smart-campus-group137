import React, { useState, useEffect } from 'react';
import { 
  fetchResources, 
  createResource, 
  updateResource, 
  deleteResource, 
  patchResourceStatus 
} from '../../services/resourceService';
import './ResourceAdminDashboard.css';

const ResourceAdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    availabilityWindow: '08:00-18:00',
    status: 'ACTIVE'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchResources();
      setResources(data);
    } catch (err) {
      console.error("Error loading resources:", err);
      alert("Failed to load dashboard data. Are you an ADMIN?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openNewModal = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      type: 'LECTURE_HALL',
      capacity: '',
      location: '',
      availabilityWindow: '08:00-18:00',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity || '',
      location: resource.location,
      availabilityWindow: resource.availabilityWindow || '',
      status: resource.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity, 10) : null
      };

      if (editingResource) {
        await updateResource(editingResource.id, payload);
      } else {
        await createResource(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving resource. Check permissions.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await patchResourceStatus(id, newStatus);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error updating status.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Error deleting resource.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Resource Management</h1>
          <p className="dashboard-subtitle">Manage all facilities and assets (Admin Only)</p>
        </div>
        <button onClick={openNewModal} className="btn-primary">
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Resource
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="p-10 text-center">Loading Data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                    <td className="text-gray-500">#{res.id}</td>
                    <td className="font-medium">{res.name}</td>
                    <td>{res.type}</td>
                    <td>{res.location}</td>
                    <td>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${res.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="text-right font-medium">
                      <button onClick={() => handleToggleStatus(res.id, res.status)} className="action-link text-gray-600">
                        Toggle Status
                      </button>
                      <button onClick={() => openEditModal(res)} className="action-link text-indigo-600">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(res.id)} className="action-link text-red-600 !mr-0">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-500 border-none">
                      No resources available. Click "Add Resource" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="e.g. Main Auditorium" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="form-select">
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="form-input" placeholder="e.g. 50" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-input" placeholder="e.g. Building A, Room 101" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Availability Window</label>
                <input type="text" name="availabilityWindow" value={formData.availabilityWindow} onChange={handleInputChange} className="form-input" placeholder="e.g. 08:00-18:00" />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingResource ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceAdminDashboard;
