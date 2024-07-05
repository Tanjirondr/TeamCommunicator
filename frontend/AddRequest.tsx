import React, { useState } from 'react';
import axios from 'axios';

interface IRequestFormData {  // Renamed for clarity
  title: string;
  description: string;
  priority: string; // Priority maintained as is
}

const AddRequestForm: React.FC = () => {  // Name made more specific to its function
  const [requestFormData, setRequestFormData] = useState<IRequestFormData>({ // Adjusted for clarity
    title: '',
    description: '',
    priority: 'Medium', // Default priority retained
  });

  const handleInputChange = (e: React.Change. Event<HTMLInputElement | HTMLSelectElement>) => { // Kept generic as it's a common handler for inputs and select
    setRequestFormData({
      ...requestFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {  // Name changed to reflect action
    e.preventDefault(); 

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/requests`, requestFormData);
      console.log('Request added successfully:', response.data);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  return (
    <form onSubmit={handleSubmitRequest}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          name="title"
          type="text"
          value={requestFormData.title}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          name="description"
          type="text"
          value={requestFormData.description}
          onChange={handleInputChange}
          required 
        />
      </div>
      <div>
        <label htmlFor="priority">Priority</label>
        <select
          name="priority"
          value={requestFormData.priority}
          onChange={handleInputChange} // Using the same handler for simplicity
          required
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default AddRequestForm; // Name export changed to match the updated component name