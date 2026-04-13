import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets } from '../services/ticketService';
import { logout } from '../services/authService';
const DUMMY_TICKETS = [
  {
    id: 1001,
    resourceName: 'Projector #3',
    description: 'The projector in Room A101 is not turning on. It keeps flashing a red light.',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  },
  {
    id: 1002,
    resourceName: 'Network Switch D',
    description: 'Intermittent connection issues observed during the afternoon.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 1003,
    resourceName: 'Lab 1',
    description: 'Air conditioning unit is leaking water.',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets([...(data || []), ...DUMMY_TICKETS]);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          console.error("Failed to fetch tickets:", err);
          // If backend fails, ensure dummy tickets still load
          setTickets(DUMMY_TICKETS);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [navigate]);

  const statusColor = (status) => {
    switch (status) {
      case 'OPEN': return '#3b82f6'; // Blue
      case 'IN_PROGRESS': return '#f59e0b'; // Orange
      case 'RESOLVED': return '#10b981'; // Green
      default: return '#64748b';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* NavBar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--bg-gradient-header)',
        color: 'var(--text-header)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span 
            onClick={() => navigate(-1)} 
            style={{ 
              cursor: 'pointer', 
              fontSize: '1.2rem', 
              padding: '5px 10px',
              borderRadius: '8px',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
            title="Go Back"
          >
            ←
          </span>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            🏛️ Smart Campus - My Tickets
          </div>
        </div>
      </nav>

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>Your Saved Tickets</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '3rem', opacity: 0.5 }}>🎫</span>
              <p style={{ marginTop: '10px' }}>You haven't submitted any tickets yet.</p>
              <button 
                onClick={() => navigate('/contact')}
                style={{
                  marginTop: '15px',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create a Ticket
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{
                  padding: '16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  background: '#fff',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: '600' }}>#{ticket.id} • {ticket.resourceName}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(ticket.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                        background: ticket.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : ticket.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: ticket.priority === 'HIGH' ? '#ef4444' : ticket.priority === 'MEDIUM' ? '#f59e0b' : '#3b82f6',
                      }}>
                        {ticket.priority}
                      </span>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                        background: `${statusColor(ticket.status)}20`,
                        color: statusColor(ticket.status),
                      }}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>
                    {ticket.description}
                  </p>
                  
                  {ticket.imageBase64 && (
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={(e) => {
                          const img = e.currentTarget.nextSibling;
                          img.style.display = img.style.display === 'none' ? 'block' : 'none';
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: '500' }}>
                        Toggle Image Attachment
                      </button>
                      <img src={ticket.imageBase64} alt="Attached to ticket" style={{ display: 'none', marginTop: '10px', maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTicketsPage;
