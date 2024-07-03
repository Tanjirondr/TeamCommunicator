import React, { useState } from 'react';
import axios from 'axios';

interface IRequestFormState {
  title: string;
  description: string;
  priority: string; // Added priority to your form state
}

const TeamCommunicatorAddRequest: React.FC = () => {
  const [formData, setFormData] = useState<IRequestFormState>({
    title: '',
    description: '',
    priority: 'Medium', // Default priority is set to Medium
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { // Updated to also handle select element
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleInputChange} // Reusing the existing change handler for simplicity
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default TeamCommunicatorAddRequest;