import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from './components/RequestList';
import RequestDetails from './scomponents/RequestDetails';
import AddRequest from './components/AddRequest';
import CommentSection from './components/CommentSection';

interface IRequest {
  id: string;
  // define other properties of a request here
}

interface IComment {
  // define the properties of a comment here
}

const App: React.FC = () => {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<IRequest | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/requests`);
      setRequests(response.data);
      clearError();
    } catch (error) {
      handleFetchError('Failed to fetch requests', error);
    }
  };

  const handleRequestSelect = async (requestId: string) => {
    try {
      await fetchRequestDetails(requestId);
      await fetchCommentsForRequest(requestId);
      clearError();
    } catch (error) {
      handleFetchError('Failed to fetch request details or comments', error);
    }
  };

  const fetchRequestDetails = async (requestId: string) => {
    const response = await axios.get(`${process.env.REACT_APP_API_UR}/requests/${requestId}`);
    setCurrentRequest(response.data);
  };

  const fetchCommentsForRequest = async (requestId: string) => {
    const response = await axios.get(`${process.env.REACT_APP_API_UR}/requests/${requestId}/comments`);
    setComments(response.data);
  };

  const clearError = () => setError('');

  const handleFetchError = (message: string, error: any) => {
    setError(message);
    console.error(error); // For debugging
  };

  const displayError = () => error && <div className="error-message" style={{ olor: 'red' }}>{error}</div>;

  return (
    <div>
      <header>
        <h1>TeamCommunicator</h1>
      </header>
      <main>
        {displayError()}
        <RequestList requests={requests} onSelectRequest={handleRequestSelect} />
        {currentRequest && <RequestDetails request={currentRequest} />}
        <AddRequest onAddRequest={fetchRequests} />
        {currentRequest && <CommentSection comments={comments} requestId={currentRequest.id} />}
      </main>
    </div>
  );
};

export default App;