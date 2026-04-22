import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStoredUser, logout } from '../services/authService';
import NotificationBell from './NotificationBell';

const GlobalNavbar = ({ isDarkMode = false, customUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = customUser || getStoredUser();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isBookingMode = ['/my-bookings', '/book', '/scanner', '/admin/bookings', '/admin/resources'].some(path => location.pathname.startsWith(path));
  const isAdminPage = ['/admin/bookings', '/admin/resources'].some(path => location.pathname.startsWith(path));

  const navLinkClass = "nav-link-text";

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: isDarkMode ? '#020617' : 'var(--bg-gradient-header)',
        color: 'var(--text-header)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        transition: 'background 0.3s',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        {isAdminPage ? (
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            Smart Campus
          </div>
        ) : (
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)', cursor: 'pointer' }} onClick={() => navigate('/')}>
            Smart Campus
          </div>
        )}
        
        {!isAdminPage && (
          <>
            <span onClick={() => navigate('/resources')} className={navLinkClass}>
              Explore Catalogue
            </span>
            <span onClick={() => navigate('/my-bookings')} className={navLinkClass}>
              Booking Facility
            </span>
            <span onClick={() => navigate('/contact')} className={navLinkClass}>
              Contact Us
            </span>
            <span onClick={() => navigate('/my-tickets')} className={navLinkClass}>
              My Tickets
            </span>
            <span onClick={() => navigate('/about')} className={navLinkClass}>
              About Us
            </span>
            
            {isBookingMode && (
              <>
                <span onClick={() => navigate('/book')} className={navLinkClass}>
                  New Booking
                </span>
                <span onClick={() => navigate('/scanner')} className={navLinkClass}>
                  QR Check-in
                </span>
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                  <>
                    <span onClick={() => navigate('/admin/bookings')} className={navLinkClass}>
                      Booking Management
                    </span>
                    <span onClick={() => navigate('/admin/resources')} className={navLinkClass}>
                      Resource Catalogue
                    </span>
                  </>
                )}
              </>
            )}
          </>
        )}
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
              <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'User'}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Signed in</span>
            </div>
            <NotificationBell />
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <img
                src={user.profilePicture || 'https://www.svgrepo.com/show/475656/google-color.svg'}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginLeft: '10px',
                fontWeight: '600',
                transition: 'background 0.2s, transform 0.2s',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ef4444';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default GlobalNavbar;
