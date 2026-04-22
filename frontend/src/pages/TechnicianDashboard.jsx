import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';
import { getAllTickets, updateTicket, getCommentsByTicket, addComment, updateComment, deleteComment } from '../services/ticketService';
import { toast } from 'react-toastify';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const fetchComments = async (ticketId) => {
    try {
      const data = await getCommentsByTicket(ticketId);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    if (selectedTicketId) {
      fetchComments(selectedTicketId);
    } else {
      setComments([]);
      setNewComment('');
    }
  }, [selectedTicketId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(selectedTicketId, newComment);
      setNewComment('');
      fetchComments(selectedTicketId);
    } catch (err) {
      toast.error('Failed to add comment');
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(selectedTicketId, commentId);
        fetchComments(selectedTicketId);
      } catch (err) {
        toast.error('Failed to delete comment');
        console.error(err);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) return;
    try {
      await updateComment(selectedTicketId, commentId, editingContent);
      setEditingCommentId(null);
      fetchComments(selectedTicketId);
    } catch (err) {
      toast.error('Failed to update comment');
      console.error(err);
    }
  };

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
          fetchTickets(userData);
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
        navigate('/login', { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const fetchTickets = async (currentUser = user) => {
    setLoading(true);
    try {
      const data = await getAllTickets();
      if (currentUser && currentUser.role === 'TECHNICIAN') {
        setTickets(data.filter(t => t.assigneeId === currentUser.id));
      } else {
        setTickets(data);
      }
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
        background: 'rgba(30, 27, 75, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'var(--text-header)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
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
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ 
            fontSize: '2.8rem', 
            fontWeight: '800', 
            letterSpacing: '-1.5px', 
            marginBottom: '8px',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>Active Tickets</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: '500' }}>Manage, track, and resolve campus maintenance requests.</p>
        </div>
        
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
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'transparent';
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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
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

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--text-main)' }}>Comments</h4>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border-color)', maxHeight: '200px', overflowY: 'auto' }}>
                  {comments.length === 0 ? (
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No comments yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {comments.map(comment => (
                        <div key={comment.id} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary-color)' }}>{comment.authorName}</span>
                              { (comment.authorRole === 'TECHNICIAN' || comment.authorId === selectedTicket.assigneeId) && (
                                <span style={{
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  color: '#3b82f6',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '0.65rem',
                                  fontWeight: 'bold',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  Assigned Technician
                                </span>
                              )}
                              {user && user.id === comment.authorId && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Edit</button>
                                  <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Delete</button>
                                </div>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                          {editingCommentId === comment.id ? (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <input 
                                type="text" 
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateComment(comment.id); }}
                              />
                              <button onClick={() => handleUpdateComment(comment.id)} style={{ background: 'var(--primary-color)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingCommentId(null)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          ) : (
                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{comment.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type a comment..." 
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment();
                    }}
                  />
                  <button 
                    onClick={handleAddComment}
                    style={{ background: 'var(--primary-gradient)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Send
                  </button>
                </div>
              </div>

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

