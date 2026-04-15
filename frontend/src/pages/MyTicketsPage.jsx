import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets, deleteTicket } from '../services/ticketService';
import { logout } from '../services/authService';

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getMyTickets();
        setTickets(data || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          console.error("Failed to fetch tickets:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [navigate]);

  const handleDelete = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(ticketId);
        setTickets(tickets.filter(t => t.id !== ticketId));
      } catch (err) {
        console.error("Failed to delete ticket:", err);
        alert("Failed to delete ticket. Please try again.");
      }
    }
  };

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
                  
                  {ticket.imagesBase64 && ticket.imagesBase64.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <button 
                        onClick={(e) => {
                          const container = e.currentTarget.nextSibling;
                          container.style.display = container.style.display === 'none' ? 'flex' : 'none';
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: '500' }}>
                        Toggle Image Attachments ({ticket.imagesBase64.length})
                      </button>
                      <div style={{ display: 'none', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                        {ticket.imagesBase64.map((img, idx) => (
                          <img key={idx} src={img} alt={`Attached to ticket ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid var(--border-color)', objectFit: 'contain' }} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      onClick={() => handleDelete(ticket.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        color: '#ef4444',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.3)'}
                      onMouseOut={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                    >
                      Delete
                    </button>
                  </div>
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
