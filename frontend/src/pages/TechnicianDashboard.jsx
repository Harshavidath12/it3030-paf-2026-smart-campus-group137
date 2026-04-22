import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';
import { getAllTickets, updateTicket } from '../services/ticketService';
import { toast } from 'react-toastify';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  useEffect(() => {
    // Fetch the logged-in user profile to get their name/email/icon
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        // Allow Admin, Technician, or Manager
        if (userData.role !== 'TECHNICIAN' && userData.role !== 'ADMIN' && userData.role !== 'MANAGER') {
          navigate('/'); // Redirect non-staff
        } else {
          setUser(userData);
          fetchTickets();
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
        navigate('/login', { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getAllTickets();
      setTickets(data);
    } catch (err) {
      toast.error('Failed to fetch tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await updateTicket(ticketId, { status: newStatus });
      toast.success(`Ticket #${ticketId} status updated to ${newStatus}`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update ticket status');
      console.error(err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif'
    }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            Smart Campus - Technician
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'Technician'}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{user.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-header)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  marginLeft: '10px',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Loading profile...</span>
          )}
        </div>
      </nav>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 2rem',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>Active Tickets</h1>
        
        <div style={{ width: '100%', maxWidth: '900px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-card)', borderRadius: '12px' }}>
              No tickets found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} style={{ 
                  background: 'var(--bg-card)', 
                  padding: '24px', 
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                >
                  <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.25rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      #{ticket.id} - {ticket.resourceName}
                    </h3>
                    <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>
                      {ticket.description}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span><strong>Creator:</strong> {ticket.creatorName}</span>
                      <span><strong>Date:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <span style={{ 
                      padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px',
                      background: ticket.status === 'OPEN' ? 'rgba(59, 130, 246, 0.15)' : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'rgba(16, 185, 129, 0.15)' : ticket.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: ticket.status === 'OPEN' ? '#3b82f6' : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? '#10b981' : ticket.status === 'REJECTED' ? '#ef4444' : '#f59e0b'
                    }}>
                      {ticket.status}
                    </span>
                    <span style={{ 
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
                        background: ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : ticket.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                        color: ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? '#ef4444' : ticket.priority === 'MEDIUM' ? '#f59e0b' : '#6b7280'
                    }}>
                        {ticket.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTicket && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px',
            backdropFilter: 'blur(4px)'
          }} onClick={() => setSelectedTicketId(null)}>
            <div style={{
              background: 'var(--bg-card)', 
              padding: '30px', 
              borderRadius: '16px', 
              width: '100%', 
              maxWidth: '650px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }} onClick={e => e.stopPropagation()}>
              
              <button 
                onClick={() => setSelectedTicketId(null)} 
                style={{ 
                  position: 'absolute', top: '15px', right: '15px', 
                  background: 'rgba(255,255,255,0.05)', border: 'none', 
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' 
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                ✕
              </button>
              
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-main)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '30px' }}>
                #{selectedTicket.id} - {selectedTicket.resourceName}
              </h2>
              
              <div style={{ marginBottom: '24px', padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Description</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>{selectedTicket.description}</p>
                
                <div style={{ display: 'flex', gap: '30px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Creator</span>
                    <span style={{ fontWeight: '500' }}>{selectedTicket.creatorName}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Priority</span>
                    <span style={{ fontWeight: '500' }}>{selectedTicket.priority}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</span>
                    <span style={{ fontWeight: '500' }}>{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {selectedTicket.imagesBase64 && selectedTicket.imagesBase64.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Attached Images</h4>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {selectedTicket.imagesBase64.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`} 
                        alt={`Attachment ${idx + 1}`} 
                        style={{ height: '160px', width: '160px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-color)' }} 
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Update Ticket Status</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={selectedTicket.status} 
                    onChange={async (e) => {
                      await handleStatusChange(selectedTicket.id, e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(0,0,0,0.02)',
                      color: 'var(--text-main)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      outline: 'none',
                      cursor: 'pointer',
                      appearance: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  >
                    {selectedTicket.status === 'OPEN' && <option value="OPEN" disabled hidden>OPEN</option>}
                    {selectedTicket.status === 'CLOSED' && <option value="CLOSED" disabled hidden>CLOSED</option>}
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TechnicianDashboard;

