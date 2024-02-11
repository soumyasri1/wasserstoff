import React, { useState } from 'react';
import './App.css';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const getAddressDetails = async () => {
    try {
      const response = await fetch(`/api/address/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch address details');
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching address details:', error);
      // Display an error message to the user
      alert('Failed to fetch address details. Please try again later.');
    }
  };
  

  return (
    <div className="App">
      <div className="container">
        <h1>Blockchain Explorer</h1>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Ethereum address"
        />
        <button onClick={getAddressDetails}>Get Address Details</button>
        {balance && (
          <div id="result">
            <h2>Address Details</h2>
            <p>Balance: {balance}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
