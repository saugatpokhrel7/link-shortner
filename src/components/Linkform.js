import React, { useState } from 'react';
import Loader from './Loader';

const Linkform = () => {
  const urlregex = new RegExp('^(http|https)://', 'i');
  const validateURL = (url) => {
    return urlregex.test(url);
  };

  const [load, setLoad] = useState(false); // Use state to track the loading status

  const handleShortenClick = () => {
    setLoad(true); // Show the loader

    const inputElement = document.querySelector('.form-control');
    const inputValue = inputElement.value;
    // console.log('Input URL:', inputValue);

    if (validateURL(inputValue)) {
      // console.log('Valid URL');

      fetch('http://localhost:5000/api/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: inputValue }),
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log('Data:', data);

          inputElement.value = '';
          // console.log('Input URL:', inputValue);

          const messageElement = document.querySelector('#message');
          messageElement.classList.add('alert-success');
          messageElement.classList.remove('alert-danger');
          setLoad(false); // Hide the loader

          messageElement.innerHTML = `Shortened URL created: <a href="http://localhost:3000/${data}">Your-link</a>`;
     
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoad(false); // Hide the loader in case of an error
        });
    } else {
      // console.log('Invalid URL');
      const messageElement = document.querySelector('#message');
      messageElement.classList.add('alert-danger');
      messageElement.classList.remove('alert-success');
      setLoad(false); // Hide the loader
      messageElement.innerHTML = 'Invalid URL';
     

    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleShortenClick();
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
        <div className="alert" id="message">
        
        </div>
      </div>
    </div>
  );
};

export default Linkform;
