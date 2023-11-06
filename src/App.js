import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    // Make a GET request to your FastAPI API
    axios.get('http://127.0.0.1:5000/processes/') // Update the URL to match your API endpoint
      .then((response) => {
          console.log('Response data:', response.data); // debug
          setProcesses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Processes:</h1>
      <ul>
        {processes.map((process) => (
          <li key={process.id}>
            {process.name} - {process.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;