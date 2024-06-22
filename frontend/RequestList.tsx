import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Request {
  id: string;
  title: string;
  description: string;
}

const TeamCommunicator: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/requests`);
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h1>Requests</h1>
      <ul>
        {
          requests.map((request) => (
            <li key={request.id}>
              <h2>{request.title}</h2>
              <p>{request.description}</p>
            </li>
          ))
        }
      </ul>
      <button onClick={() => alert('Add New Request functionality not implemented')}>Add New Request</button>
    </div>
  );
};

export default TeamCommunicator;