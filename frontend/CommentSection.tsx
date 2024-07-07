import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
}

interface TeamCommunicatorProps {}

const TeamCommunicator: React.FC<TeamCommunicatorProps> = () => {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const fetchAllComments = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/comments`);
      setCommentsList(response.data);
    };

    fetchAllComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentInput) return;

    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
      content: commentInput,
    });
    setCommentsList([...commentsList, response.data]);
    setCommentInput('');
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {commentsList.map((comment) => (
          <li key={comment.id}>{comment.content} (Posted on {new Date(comment.createdAt).toLocaleString()})</li>
        ))}
      </ul>
      <div>
        <textarea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleCommentSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TeamCommunicator;