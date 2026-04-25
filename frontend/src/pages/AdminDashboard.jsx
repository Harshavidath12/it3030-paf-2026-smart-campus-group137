import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout, getAllUsers, adminCreateUser, adminDeleteUser } from '../services/authService';
import './AuthPages.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'TECHNICIAN' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        if (userData.role !== 'ADMIN') {
          navigate('/');
        } else {
          setUser(userData);
          fetchUsersList();
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
        navigate('/login', { replace: true });
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchUsersList = async () => {
    setLoadingUsers(true);
    try {
      const data = await getAllUsers();
      if (Array.isArray(data)) {
        data.sort((a, b) => a.id - b.id);
      }
      setUsersList(data);
    } catch (err) {
      console.error('Error fetching users map', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminDeleteUser(userId);
        fetchUsersList();
      } catch (err) {
        console.error('Failed to delete user', err);
        alert('Failed to delete user.');
      }
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    setAdding(true);
    try {
      await adminCreateUser(newUser.name, newUser.email, newUser.password, newUser.role);
      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'TECHNICIAN' });
      fetchUsersList();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to create user. Email may already exist.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        color: 'var(--text-main)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'var(--bg-gradient-header)',
          color: 'var(--text-header)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            Smart Campus - Admin
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'Admin'}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Admin Role</span>
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
                  transition: 'background 0.2s',
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

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '5vh',
          paddingBottom: '5vh',
          gap: '20px',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>
            Admin Dashboard
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: '1.1rem',
              lineHeight: '1.6',
            }}
          >
            Welcome to the Administrative Control Panel. Here you can view and manage user records for the Smart Campus system.
          </p>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button 
              onClick={() => navigate('/admin/resources')}
              style={{
                background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', 
                border: '1px solid var(--primary)', padding: '10px 20px', 
                borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}
            >
              ⚙️ Manage Facilities & Assets
            </button>
            <button 
              onClick={() => navigate('/admin/tickets')}
              style={{
                background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                border: '1px solid #ef4444', padding: '10px 20px', 
                borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
              }}
            >
              🎟️ Handle Tickets
            </button>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '2rem',
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              Registered Users
              {loadingUsers && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Loading...)</span>}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/admin/bookings')}
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Booking Management
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span> Add User
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.95rem',
              }}
            >
              <thead style={{ background: 'var(--bg-gradient-header)' }}>
                <tr>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>ID</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Email</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px' }}>Role</th>
                  <th style={{ padding: '14px 16px', color: 'var(--text-header)', fontWeight: '600', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.length === 0 && !loadingUsers ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  usersList.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{
                        background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                        borderTop: '1px solid var(--border-color)',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)')}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--text-muted)' }}>#{u.id}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '500' }}>
                        {u.name || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--primary-color)' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            background:
                              u.role === 'ADMIN'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : u.role === 'MANAGER'
                                  ? 'rgba(139, 92, 246, 0.15)'
                                  : u.role === 'TECHNICIAN'
                                    ? 'rgba(245, 158, 11, 0.15)'
                                    : 'rgba(59, 130, 246, 0.15)',
                            color:
                              u.role === 'ADMIN'
                                ? '#ef4444'
                                : u.role === 'MANAGER'
                                  ? '#8b5cf6'
                                  : u.role === 'TECHNICIAN'
                                    ? '#f59e0b'
                                    : 'var(--primary-color)',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px',
                              borderRadius: '6px',
                              transition: 'background 0.2s',
                            }}
                            title="Delete User"
                            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                            onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              padding: '30px',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', fontWeight: '700' }}>Add New Staff</h2>

            {addError && (
              <div
                style={{
                  color: 'var(--input-error)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  fontSize: '0.9rem',
                }}
              >
                {addError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="auth-form" style={{ marginTop: '10px' }}>
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="e.g. John Doe" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="e.g. john@smartcampus.edu"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  required
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="********"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={{ color: 'var(--text-main)' }}>
                  <option value="TECHNICIAN">Technician</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User (Default)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  style={{
                    background: 'var(--primary-gradient)',
                    border: 'none',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {adding ? 'Creating...' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
