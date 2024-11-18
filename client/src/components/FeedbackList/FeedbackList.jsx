import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Download, Plus } from 'lucide-react';
import TableHeader from './TableHeader';
import FeedbackTable from './FeedbackTable';
import Pagination from './Pagination';

const FeedbackList = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, entriesPerPage, searchTerm]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/feedback-forms', {
        params: {
          page: currentPage,
          limit: entriesPerPage,
          search: searchTerm
        }
      });
      setFeedbacks(response.data.feedbacks);
      setTotalEntries(response.data.total);
      setError(null);
    } catch (error) {
      setError('Failed to fetch feedbacks');
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback-forms/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const handleActiveToggle = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/feedback-forms/${id}/toggle-active`);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback-forms', {
        params: { export: true }
      });
      
      const csvContent = [
        ['Name', 'Title', 'Type', 'Active', 'Created Date', 'Modified Date', 'Link'],
        ...response.data.feedbacks.map(feedback => [
          feedback.name,
          feedback.title,
          feedback.type,
          feedback.active ? 'Yes' : 'No',
          new Date(feedback.createdDate).toLocaleDateString(),
          feedback.modifiedDate ? new Date(feedback.modifiedDate).toLocaleDateString() : '-',
          `https://yourapp.com/forms/${feedback.formLink}`
        ])
      ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback-forms.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting feedback:', error);
  }
};

  const assignmentOptions = [
    { label: 'Branch 1', value: 'branch1' },
    { label: 'Branch 2', value: 'branch2' },
    { label: 'Department 1', value: 'dept1' },
    { label: 'Department 2', value: 'dept2' }
  ];

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    setEntriesPerPage(25);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
        <Button onClick={() => navigate('/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Create New Form
        </Button>
      </div>

      <TableHeader
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <FeedbackTable
        feedbacks={feedbacks}
        currentPage={currentPage}
        entriesPerPage={entriesPerPage}
        onDelete={handleDelete}
        onActiveToggle={handleActiveToggle}
        onEdit={(feedback) => navigate(`/edit/${feedback._id}`)}
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalEntries / entriesPerPage)}
        setCurrentPage={setCurrentPage}
        totalEntries={totalEntries}
        entriesPerPage={entriesPerPage}
      />
    </div>
  );
};

export default FeedbackList;