import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackFormGenerator from './form/form';
import FeedbackList from './FeedbackList/FeedbackList';

const HomePage = () => {
  const generatorRef = useRef(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const { id } = useParams(); // Get the id parameter from the URL
  const navigate = useNavigate();

  // Handle edit function
  const handleEdit = (feedback) => {
    // Set the feedback data for editing
    setEditingFeedback({
      feedbackName: feedback.name,
      feedbackTitle: feedback.title,
      type: feedback.type,
      fields: feedback.fields,
      id: feedback._id
    });

    // Update the URL to reflect editing state
    navigate(`/edit/${feedback._id}`);
    
    // Scroll to the generator
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effect to handle URL-based editing
  useEffect(() => {
    if (id) {
      // If you have an API, fetch the feedback data based on id
      // and set it to editingFeedback
      // For now, you might need to find it in your existing data
      // fetchFeedbackById(id).then(feedback => setEditingFeedback(feedback));
    }
  }, [id]);

  return (
    <div className="home-page">
      <FeedbackFormGenerator
        ref={generatorRef}
        editingFeedback={editingFeedback}
        onCancelEdit={() => {
          setEditingFeedback(null);
          navigate('/'); // Return to home page when canceling edit
        }}
      />
      
      <FeedbackList 
        onEdit={handleEdit}
      />
    </div>
  );
};

export default HomePage;