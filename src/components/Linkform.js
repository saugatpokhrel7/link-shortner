import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const Linkform = () => {
  const urlregex = new RegExp('^(http|https)://', 'i');
  const validateURL = (url) => {
    return urlregex.test(url);
  };

  const [load, setLoad] = useState(false);
  const [shortenedURL, setShortenedURL] = useState('');
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleShortenClick = () => {
    setLoad(true); // Show the loader
    const messageElement = document.querySelector('#message');
    const copyElement = document.querySelector('#cpye');
    messageElement.style.display = 'none';

    const inputElement = document.querySelector('.form-control');
    const inputValue = inputElement.value;

    if (validateURL(inputValue)) {
      fetch('http://localhost:5000/api/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: inputValue }),
      })
        .then((res) => res.json())
        .then((data) => {
          inputElement.value = '';
          messageElement.classList.add('alert-success');
          messageElement.classList.remove('alert-danger');
          setLoad(false); // Hide the loader
          messageElement.style.display = 'inline';
          setShortenedURL(data);
          messageElement.innerHTML = `
            Shortened URL created: 
            <a href="http://localhost:3000/${data}" target="_blank" rel="noopener noreferrer">Your-link</a>
        
          `;
          copyElement.style.display = 'inline';
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoad(false);
        });
    } else {
      const messageElement = document.querySelector('#message');
      messageElement.style.display = 'none';
      messageElement.classList.add('alert-danger');
      messageElement.classList.remove('alert-success');
      setLoad(false);
      messageElement.style.display = 'block';
      messageElement.innerHTML = 'Invalid URL';
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleShortenClick();
    }
  };

  const copyToClipboard = (data) => {
    if (shortenedURL) {
      const tempInput = document.createElement('input');
      tempInput.value = `http://localhost:3000/${shortenedURL}`;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      const copyElement = document.querySelector('#cpye');
      copyElement.style.display = 'none';
      const messageElement = document.querySelector('#message');
      messageElement.style.display = 'block';
      messageElement.innerHTML = 'Link copied to clipboard';
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 1000);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter URL"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onKeyDown={handleKeyDown}
            />
            <button
              className="btn btn-outline-secondary mx-3"
              type="button"
              id="button-addon2"
              onClick={handleShortenClick}
            >
              Shorten
            </button>
          </div>
        </div>
        <div>
          {load ? <Loader /> : ''}
        </div>
        {!online && (
          <div className="alert alert-warning">
            You are currently offline. Please check your internet connection.
          </div>
        )}
        <div className="alert" id="message">
        </div>
        <div className="cpyhandle" id='cpye' style={{ display: 'none' }}>
          <button
            className="btn btn-outline-secondary mx-3"
            type="button"
            id="button-addon2"
            onClick={() => copyToClipboard()}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Linkform;
