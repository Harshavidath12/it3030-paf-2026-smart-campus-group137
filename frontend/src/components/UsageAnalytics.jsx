import React, { useEffect, useState } from 'react';
import { fetchAdminBookings } from '../services/bookingAdminService';

const UsageAnalytics = ({ resources }) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeResources: 0,
    uniqueUsers: 0,
    topResources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const bookings = await fetchAdminBookings();
        
        // Calculate Top Resources
        const counts = {};
        const nonRejected = bookings.filter(b => b.status !== 'REJECTED' && b.status !== 'CANCELLED');
        
        nonRejected.forEach(b => {
          counts[b.resourceId] = (counts[b.resourceId] || 0) + 1;
        });
        
        const top = Object.entries(counts)
          .map(([resId, count]) => {
             const res = resources.find(r => r.id.toString() === resId.toString());
             return {
                id: resId,
                name: res ? res.name : `Resource #${resId}`,
                count
             };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, 7); // Sync with bar count for better display

        setStats({
            totalBookings: nonRejected.length,
            activeResources: resources.filter(r => r.status === 'ACTIVE').length,
            uniqueUsers: new Set(bookings.map(b => b.userEmail)).size,
            topResources: top
        });
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    if (resources && resources.length > 0) {
      loadAnalytics();
    } else if (resources && resources.length === 0) {
      setLoading(false);
    }

    // Live update polling: check for new bookings every 30 seconds
    const pollInterval = setInterval(() => {
      if (resources && resources.length > 0) {
        loadAnalytics();
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [resources]);

  if (loading) return null;

  const maxCount = stats.topResources.length > 0 ? Math.max(...stats.topResources.map(a => a.count)) : 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginBottom: '40px' }}>
      {/* Top Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
         {/* Total Bookings Card */}
         <div style={{ 
           background: '#eef2ff', padding: '24px', borderRadius: '28px', 
           border: '1px solid rgba(79, 70, 229, 0.05)', position: 'relative'
         }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0' }}>Total Bookings</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h3 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0, color: '#1e1b4b' }}>{stats.totalBookings}</h3>
              <div style={{ width: '60px', height: '30px', color: '#4f46e5' }}>
                <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 40 L30 20 L50 35 L70 10 L90 25" />
                </svg>
              </div>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                background: 'white', padding: '4px 10px', borderRadius: '8px', 
                color: '#4f46e5', fontWeight: '800', fontSize: '0.8rem',
                boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)'
              }}>12.5% ↑</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Since last month</span>
            </div>
         </div>

         {/* Active Resources Card */}
         <div style={{ 
           background: '#fff1f2', padding: '24px', borderRadius: '24px', 
           border: '1px solid rgba(225, 29, 72, 0.05)', position: 'relative'
         }}>
            <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '700', margin: '0 0 12px 0' }}>Active Resources</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h3 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0, color: '#1e1b4b' }}>{stats.activeResources}</h3>
              <div style={{ width: '60px', height: '30px', color: '#e11d48' }}>
                <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 40 L30 20 L50 35 L70 10 L90 25" />
                </svg>
              </div>
            </div>
            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                background: 'white', padding: '4px 10px', borderRadius: '8px', 
                color: '#e11d48', fontWeight: '800', fontSize: '0.8rem',
                boxShadow: '0 2px 4px rgba(225, 29, 72, 0.1)'
              }}>12.5% ↑</span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Since last month</span>
            </div>
         </div>
      </div>

      {/* Main Graph Card */}
      <div style={{
          background: 'white',
          borderRadius: '32px',
          padding: '35px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #e0e7ff, #ede9fe)', 
            padding: '12px', borderRadius: '14px', display: 'flex',
            color: '#4f46e5', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#1e1b4b' }}>
              Usage Analytics
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
              Top Performing Resources by Bookings
            </p>
          </div>
        </div>
        
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'flex-end', 
            height: '220px', 
            marginTop: '50px', 
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '0'
        }}>
          {stats.topResources.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
               <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#4f46e5', marginBottom: '10px' }}>
                  {item.count}
               </div>
               <div style={{ 
                   width: '56px', 
                   height: `${Math.max((item.count / maxCount) * 160, 15)}px`, 
                   background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                   borderRadius: '12px 12px 0 0',
                   transition: 'height 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                   boxShadow: '0 -4px 12px rgba(99, 102, 241, 0.15)'
               }} />
            </div>
          ))}
         </div>

         <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
          {stats.topResources.map((item, idx) => (
            <div key={idx} style={{ 
                width: '120px', 
                textAlign: 'center',
                fontWeight: '800', 
                fontSize: '0.9rem', 
                color: '#334155'
            }}>
               Resource #{item.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageAnalytics;
