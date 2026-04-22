import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout, getAllUsers } from '../services/authService';
import { getAllTickets, updateTicket } from '../services/ticketService';
import { toast } from 'react-toastify';

const TicketHandlePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterResource, setFilterResource] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterUnassigned, setFilterUnassigned] = useState(false);

  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const userData = await getMe();
        if (userData.role !== 'ADMIN') {
          navigate('/');
        } else {
          setUser(userData);
          fetchTickets();
          fetchTechnicians();
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
        navigate('/login', { replace: true });
      }
    };
    fetchUserAndData();
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

  const fetchTechnicians = async () => {
    try {
      const users = await getAllUsers();
      if (Array.isArray(users)) {
        const techs = users.filter(u => u.role === 'TECHNICIAN');
        setTechnicians(techs);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleAssignTechnician = async (ticketId, assigneeIdStr) => {
    try {
      const assigneeId = assigneeIdStr ? parseInt(assigneeIdStr, 10) : null;
      await updateTicket(ticketId, { assigneeId });
      toast.success(`Technician assigned to Ticket #${ticketId}`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to assign technician');
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
            Smart Campus - Ticket Management
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
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'Admin'}</span>
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
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <span
            onClick={() => navigate('/admin-dashboard')}
            style={{
              cursor: 'pointer',
              color: 'var(--primary-color)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            ← Back to Dashboard
          </span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>All Tickets</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Administer all student-created tickets and assign them to technicians.</p>
        </div>

        <div style={{
          width: '100%',
          marginTop: '1rem',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              Ticket Management
              {loading && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Loading...)</span>}
            </h2>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '24px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.01) 100%)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}></span> Filter Tickets
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: '220px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>Resource Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={filterResource}
                    onChange={(e) => setFilterResource(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                >
                  <option value="">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.2)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; }}
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
                <button
                  onClick={() => setFilterUnassigned(!filterUnassigned)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: filterUnassigned ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: filterUnassigned ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                    color: filterUnassigned ? 'var(--primary-color)' : 'var(--text-muted)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: filterUnassigned ? '0 0 0 1px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: filterUnassigned ? 'var(--primary-color)' : 'rgba(0,0,0,0.2)',
                    transition: 'background 0.2s'
                  }}></div>
                  Unassigned Only
                </button>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.95rem',
            }}>
              <thead style={{ background: 'var(--bg-gradient-header)' }}>
                <tr>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>ID</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Resource & Desc</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Creator</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Date</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Status & Priority</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Assign Technician</th>
                </tr>
              </thead>
              <tbody>
                {tickets.filter(ticket => {
                  let match = true;
                  if (filterResource && !ticket.resourceName.toLowerCase().includes(filterResource.toLowerCase())) {
                    match = false;
                  }
                  if (filterStatus && ticket.status !== filterStatus) {
                    match = false;
                  }
                  if (filterPriority && ticket.priority !== filterPriority) {
                    match = false;
                  }
                  if (filterUnassigned && ticket.assigneeId) {
                    match = false;
                  }
                  return match;
                }).length === 0 && !loading ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No tickets found matching your filters.
                    </td>
                  </tr>
                ) : (
                  tickets.filter(ticket => {
                    let match = true;
                    if (filterResource && !ticket.resourceName.toLowerCase().includes(filterResource.toLowerCase())) {
                      match = false;
                    }
                    if (filterStatus && ticket.status !== filterStatus) {
                      match = false;
                    }
                    if (filterPriority && ticket.priority !== filterPriority) {
                      match = false;
                    }
                    if (filterUnassigned && ticket.assigneeId) {
                      match = false;
                    }
                    return match;
                  }).map((ticket, i) => (
                    <tr
                      key={ticket.id}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                        borderTop: '1px solid var(--border-color)',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-muted)', verticalAlign: 'top' }}>
                        #{ticket.id}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top', maxWidth: '300px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>{ticket.resourceName}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ticket.description}>
                          {ticket.description}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top', fontWeight: '500' }}>
                        {ticket.creatorName}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            background: ticket.status === 'OPEN' ? 'rgba(59, 130, 246, 0.15)'
                              : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'rgba(16, 185, 129, 0.15)'
                                : ticket.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                            color: ticket.status === 'OPEN' ? '#3b82f6'
                              : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? '#10b981'
                                : ticket.status === 'REJECTED' ? '#ef4444'
                                  : '#f59e0b',
                          }}>
                            {ticket.status}
                          </span>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            background: ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)'
                              : ticket.priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(107, 114, 128, 0.15)',
                            color: ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL' ? '#ef4444'
                              : ticket.priority === 'MEDIUM' ? '#f59e0b'
                                : '#6b7280',
                          }}>
                            {ticket.priority} Priority
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                        <select
                          value={ticket.assigneeId || ''}
                          onChange={(e) => handleAssignTechnician(ticket.id, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: ticket.assigneeId ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.05)',
                            border: ticket.assigneeId ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                            color: ticket.assigneeId ? 'var(--primary-color)' : 'var(--text-main)',
                            fontWeight: ticket.assigneeId ? 'bold' : 'normal',
                            cursor: 'pointer',
                            width: '100%',
                            minWidth: '150px',
                            outline: 'none',
                            transition: 'all 0.2s'
                          }}
                        >
                          <option value="">-- Unassigned --</option>
                          {technicians.map(tech => (
                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketHandlePage;
