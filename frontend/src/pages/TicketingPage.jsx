import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket, getMyTickets } from '../services/ticketService';
import { getMe, logout } from '../services/authService';

const RESOURCES = [
  "Room A101",
  "Room B205",
  "Auditorium",
  "Lab 1",
  "Projector #3",
  "Network Switch D",
  "HVAC System Wing A"
];

const TicketingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Form State
  const [resource, setResource] = useState(RESOURCES[0]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const u = await getMe();
        setUser(u);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          console.error("Failed to fetch user:", err);
        }
      }
    };
    init();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');

    // Frontend Validations
    if (!/^[0-9]{10}$/.test(contactNumber)) {
      setSubmitMessage('Failed: Contact number must be exactly 10 digits.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitMessage('Failed: Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const newTicket = await createTicket({
        resourceName: resource,
        description: description,
        priority: priority,
        contactNumber: contactNumber,
        email: email,
        imageBase64: image
      });
      // Reset form
      setResource(RESOURCES[0]);
      setDescription('');
      setPriority('LOW');
      setContactNumber('');
      setEmail('');
      setImage(null);
      // reset file input
      const fileInput = document.getElementById('ticket-image-upload');
      if (fileInput) fileInput.value = '';
      
      setSubmitMessage('Ticket successfully created!');
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (err) {
      setSubmitMessage('Failed to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
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
            🏛️ Smart Campus - Ticketing
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span 
            onClick={() => navigate('/my-tickets')}
            className="nav-link-text"
          >
            My Tickets
          </span>
        </div>
      </nav>

      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
      }}>
        
        {/* Creation Form */}
        <div style={{
          background: 'var(--bg-card)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: '700' }}>Submit a Ticket</h2>
          {submitMessage && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              marginBottom: '15px', 
              background: submitMessage.includes('Failed') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: submitMessage.includes('Failed') ? '#ef4444' : '#10b981',
              fontWeight: '500'
            }}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Resource</label>
              <select 
                value={resource} 
                onChange={(e) => setResource(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff' }}
              >
                {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Issue Description</label>
              <textarea 
                required
                rows="4"
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue... (e.g., The projector bulb is burnt out)"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Contact Number</label>
                <input 
                  type="tel"
                  required
                  maxLength={10}
                  value={contactNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setContactNumber(val);
                  }}
                  placeholder="0712345678"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Email</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Priority</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['LOW', 'MEDIUM', 'HIGH'].map(p => {
                  let activeColor = '#3b82f6'; // blue
                  let activeBg = 'rgba(59, 130, 246, 0.1)';
                  
                  if (p === 'MEDIUM') {
                    activeColor = '#eab308'; // yellow
                    activeBg = 'rgba(234, 179, 8, 0.1)';
                  } else if (p === 'HIGH') {
                    activeColor = '#ef4444'; // red
                    activeBg = 'rgba(239, 68, 68, 0.1)';
                  }

                  return (
                    <label key={p} style={{ 
                      flex: 1, textAlign: 'center', padding: '8px', cursor: 'pointer',
                      background: priority === p ? activeBg : 'transparent',
                      border: `1px solid ${priority === p ? activeColor : 'var(--border-color)'}`,
                      borderRadius: '8px', fontWeight: priority === p ? '600' : 'normal',
                      color: priority === p ? activeColor : 'var(--text-main)',
                      transition: 'all 0.2s'
                    }}>
                      <input 
                        type="radio" 
                        name="priority" 
                        value={p} 
                        checked={priority === p} 
                        onChange={(e) => setPriority(e.target.value)} 
                        style={{ display: 'none' }}
                      />
                      {p}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Optional Image</label>
              <input 
                id="ticket-image-upload"
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
              />
              {image && (
                <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={image} alt="Preview" style={{ width: '100%', display: 'block', maxHeight: '150px', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              style={{
                marginTop: '10px',
                background: 'var(--primary-gradient)',
                color: '#fff',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: 'var(--shadow-md)'
              }}
              onMouseOver={(e) => { if (!submitting) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={(e) => { if (!submitting) e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {submitting ? 'Submitting...' : 'Create Ticket'}
            </button>
          </form>
        </div>


      </main>
    </div>
  );
};

export default TicketingPage;
