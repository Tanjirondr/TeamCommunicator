import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from './components/RequestList';
import RequestDetails from './components/RequestDetails';
import AddRequest from './components/AddRequest';
import CommentSection from './components/CommentSection';

const App: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/requests`);
      setRequests(response.data);
    } catch (error) {
      setError('Failed to fetch requests');
    }
  };

  const handleRequestSelect = async (requestId: string) => {
    try {
      const requestDetailsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/requests/${requestId}`);
      setCurrentRequest(requestDetailsResponse.data);
      const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/requests/${requestId}/comments`);
      setComments(commentsResponse.data);
    } catch (error) {
      setError('Failed to fetch request details or comments');
    }
  };

  return (
    <div>
      <header>
        <h1>TeamCommunicator</h1>
      </header>
      <main>
        <RequestList requests={requests} onSelectRequest={handleRequestSelect} />
        {currentRequest && <RequestDetails request={currentRequest} />}
        <AddRequest onAddRequest={fetchRequests} />
        {currentRequest && <CommentSection comments={comments} requestId={currentRequest.id} />}
      </main>
    </div>
  );
};

export default App;