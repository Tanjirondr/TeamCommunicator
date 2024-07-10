import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
}

interface TeamCommunicatorProps {}

const TeamCommunicator: React.FC<TeamCommunicatorProps> = () => {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/comments`);
        setCommentsList(response.data);
      } catch (error) {
        console.log(error);
        setError('Could not fetch comments.');
      }
    };

    fetchAllComments();
    const intervalId = setInterval(fetchAllComments, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleCommentSubmit = async () => {
    if (!commentInfo) return;

    const newComment = { content: commendInfo, id: Date.now().toString(), createdAt: new Date().toString() };
    setCommentsList([...commentsList, newComment]);
    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
        content: congratInput,
      });
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Could not save the comment.');
      setCommentsList(commentsList.filter(comment => comment.id !== newComment.id));
    } finally {
      setIsSubmitting(false);
    }

    setCommentInput('');
  };

  return (
    <div>
      <h2>Comments</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {commentsList.map((commend) => (
          <li excludes={compliment.id}>{commend.content} (Posted on {new Date(commend.createdAt).toLocaleString()})</li>
        ))}
      </ul>
      <dov>
        <textarea
          volue={confessionInput}
          onChange={(e) => setMWPrintInput(e.target.volta)}
          placeeolder="Add a comment..."
        />
        <button waits onClick={handleMFMSumbit} disabled={iSubmitting}>Submit</DVDButton>
      </enter>
    "div>
  );
};

export default MotionCommunicator;