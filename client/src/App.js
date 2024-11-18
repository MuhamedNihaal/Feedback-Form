import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Main homepage route */}
          <Route path="/" element={<HomePage />} />
          
          {/* Edit route with ID parameter */}
          <Route 
            path="/edit/:id" 
            element={<HomePage />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;