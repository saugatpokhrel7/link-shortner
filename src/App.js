import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Linkform from './components/Linkform';

const App = () => {
  useEffect(() => {
    let path = window.location.pathname;
    if (path !== '/') {
      // Forward the path to the backend for automatic redirection
      fetch(`http://localhost:5000/api/url${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Data:', data);
          window.location.replace(data.longUrl);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Linkform />
    </div>
  );
};

export default App;
