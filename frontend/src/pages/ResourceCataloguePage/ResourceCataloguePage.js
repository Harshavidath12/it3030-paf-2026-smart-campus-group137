import React, { useState, useEffect } from 'react';
import { fetchResources } from '../../services/resourceService';
import './ResourceCataloguePage.css';

const ResourceCataloguePage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchResources(filterType, filterLocation, filterCapacity);
      setResources(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load resources. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterLocation, filterCapacity]);

  return (
    <div className="catalogue-container">
      <div className="catalogue-header">
        <h1 className="catalogue-title">Smart Campus Facilities</h1>
        <p className="catalogue-subtitle">
          Browse our catalogue of bookable resources including lecture halls, labs, and specialized equipment.
        </p>
      </div>

      <div className="filters-section">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="LECTURE_HALL">Lecture Hall</option>
          <option value="LAB">Laboratory</option>
          <option value="MEETING_ROOM">Meeting Room</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>

        <input
          type="text"
          placeholder="Filter by location (e.g., Block A)..."
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="filter-input"
        />

        <input
          type="number"
          placeholder="Min Capacity (e.g., 50)..."
          value={filterCapacity}
          onChange={(e) => setFilterCapacity(e.target.value)}
          className="filter-input"
        />
      </div>

      {error && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 shadow-sm animate-pulse">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="empty-state-title">No resources found</h3>
          <p className="empty-state-desc">We couldn't find anything matching your current filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {resources.map((res) => (
            <div key={res.id} className="resource-card group">
              <span className={`resource-badge ${res.status === 'ACTIVE' ? 'badge-active' : 'badge-inactive'}`}>
                {res.status === 'ACTIVE' ? 'Active' : 'Out of Service'}
              </span>
              
              <h3 className="resource-name">{res.name}</h3>
              
              <div className="mt-4 space-y-2 flex-grow">
                <div className="resource-detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium text-gray-700">{res.type}</span>
                </div>
                
                {res.capacity && (
                  <div className="resource-detail">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Capacity: {res.capacity} people</span>
                  </div>
                )}
                
                <div className="resource-detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{res.location}</span>
                </div>
                
                <div className="resource-detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{res.availabilityWindow || 'N/A'}</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                  disabled={res.status === 'OUT_OF_SERVICE'}
                >
                  {res.status === 'OUT_OF_SERVICE' ? 'Unavailable' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceCataloguePage;
