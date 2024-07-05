import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
}

interface TeamCommunicatorProps {}

const TeamCommunicator: React.FC<TeamCommunicatorProps> = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/comments`);
      setComments(response.data);
    };

    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!newComment) return;

    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
      content: newComment,
    });
    setComments([...comments, response.data]);
    setNewComment('');
  };

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content} (Posted on {comment.createdAt.toString()})</li>
        ))}
      </ul>
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
};

export default TeamCommunicator;