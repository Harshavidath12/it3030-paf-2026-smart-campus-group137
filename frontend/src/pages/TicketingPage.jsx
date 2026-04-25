import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket, getMyTickets } from '../services/ticketService';
import { getMe, logout } from '../services/authService';
import { getAllResources } from '../services/resourceService';
import GlobalNavbar from '../components/GlobalNavbar';

const TicketingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [resources, setResources] = useState([]);

  // Form State
  const [resource, setResource] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('LOW');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [images, setImages] = useState([]);
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
      try {
        const data = await getAllResources();
        const list = Array.isArray(data) ? data : (data.content || []);
        setResources(list);
        if (list.length > 0) setResource(list[0].name);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };
    init();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (images.length >= 3) {
        alert("You can only upload up to 3 images.");
        e.target.value = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
        e.target.value = ''; // reset so same file can be selected again if needed
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
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
        imagesBase64: images.length > 0 ? images : null
      });
      // Reset form
      setResource(resources.length > 0 ? resources[0].name : '');
      setDescription('');
      setPriority('LOW');
      setContactNumber('');
      setEmail('');
      setImages([]);
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
      <GlobalNavbar customUser={user} />

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
                {resources.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.9rem' }}>Optional Pictures (Up to 3)</label>
              {images.length < 3 && (
                <input 
                  id="ticket-image-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                />
              )}
              {images.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {images.map((img, index) => (
                    <div key={index} style={{ position: 'relative', width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={img} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute', top: '5px', right: '5px',
                          background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
                          borderRadius: '50%', width: '24px', height: '24px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
                        }}>
                        X
                      </button>
                    </div>
                  ))}
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
