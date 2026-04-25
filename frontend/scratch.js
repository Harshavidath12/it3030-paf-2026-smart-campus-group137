const http = require('http');

http.get('http://localhost:8084/api/bookings/admin', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Bookings:', data.substring(0, 500)));
});
