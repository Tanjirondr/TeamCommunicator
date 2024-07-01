import React, { useState } from 'react';
import axios from 'axios';

interface IRequestFormState {
  title: string;
  description: string;
}

const TeamCommunicatorAddRequest: React.FC = () => {
  const [formData, setFormData] = useState<IRequestFormState>({
    title: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/requests`, formData);
      console.log('Request added successfully:', response.data);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          name="description"
          type="text"
          value={formData.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TeamCommunicatorAddRequest;