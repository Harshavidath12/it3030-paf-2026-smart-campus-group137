import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets, deleteTicket, getCommentsByTicket, addComment, updateComment, deleteComment } from '../services/ticketService';
import { getMe, logout } from '../services/authService';
import GlobalNavbar from '../components/GlobalNavbar';

const TicketCard = ({ ticket, onDelete, statusColor, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  const handleToggleComments = async () => {
    if (!showComments) {
      try {
        const data = await getCommentsByTicket(ticket.id);
        setComments(data || []);
      } catch (err) {
        console.error("Failed to load comments");
      }
    }
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(ticket.id, newComment);
      setNewComment('');
      const data = await getCommentsByTicket(ticket.id);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(ticket.id, commentId);
        const data = await getCommentsByTicket(ticket.id);
        setComments(data || []);
      } catch (err) {
        console.error("Failed to delete comment", err);
      }
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editingContent.trim()) return;
    try {
      await updateComment(ticket.id, commentId, editingContent);
      setEditingCommentId(null);
      const data = await getCommentsByTicket(ticket.id);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  return (
    <div style={{
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

      <div style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
        <button 
          onClick={handleToggleComments}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: '0.85rem', fontWeight: '600' }}
        >
          {showComments ? 'Hide Comments' : 'View / Add Comments'}
        </button>
        
        {showComments && (
          <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.02)', padding: '15px', borderRadius: '8px' }}>
            {comments.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '10px' }}>No comments yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{ background: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--primary)' }}>{comment.authorName}</span>
                        { (comment.authorRole === 'TECHNICIAN' || comment.authorId === ticket.assigneeId) && (
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
                        {currentUser && currentUser.id === comment.authorId && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => { setEditingCommentId(comment.id); setEditingContent(comment.content); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Edit</button>
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
                          style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateComment(comment.id); }}
                        />
                        <button onClick={() => handleUpdateComment(comment.id)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditingCommentId(null)} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{comment.content}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type a reply..." 
                style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
              />
              <button 
                onClick={handleAddComment}
                style={{ background: 'var(--primary-gradient)', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button 
          onClick={() => onDelete(ticket.id)}
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
  );
};

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        const data = await getMyTickets();
        setTickets(data || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          console.error("Failed to fetch data:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      <GlobalNavbar />

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
                <TicketCard key={ticket.id} ticket={ticket} onDelete={handleDelete} statusColor={statusColor} currentUser={user} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyTicketsPage;
