import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import MultiSelect from '../../components/ui/multi-select';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

const FeedbackFormGenerator = React.forwardRef((props, ref) => {
  
  const { editingFeedback, onCancelEdit } = props;
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formConfig, setFormConfig] = useState({
    feedbackName: '',
    feedbackTitle: '',
    assignedFor: [],
    type: '',
    fields: {
      name: false,
      mobile: false,
      emailId: false,
      age: false
    },
    questions: [{ question: '', type: '' }]
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const assignmentOptions = [
    { label: 'Branch 1', value: 'branch1' },
    { label: 'Branch 2', value: 'branch2' },
    { label: 'Department 1', value: 'dept1' },
    { label: 'Department 2', value: 'dept2' }
  ];

  useEffect(() => {
    if (isEditMode) {
      fetchFeedbackData();
    }
  }, [id]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/feedback-forms/${id}`);
      const feedback = response.data.data;
      
      setFormConfig({
        feedbackName: feedback.name,
        feedbackTitle: feedback.title,
        assignedFor: feedback.assignedFor || [],
        type: feedback.type,
        fields: feedback.fields,
        questions: feedback.questions || [{ question: '', type: '' }]
      });
    } catch (error) {
      setError('Failed to fetch feedback data');
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldToggle = (field) => {
    setFormConfig(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: !prev.fields[field]
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setError('');
    setSuccess(false);
    setFormConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formConfig.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setFormConfig(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setFormConfig(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', type: '' }]
    }));
  };

  const removeQuestion = (index) => {
    if (formConfig.questions.length > 1) {
      const updatedQuestions = formConfig.questions.filter((_, i) => i !== index);
      setFormConfig(prev => ({
        ...prev,
        questions: updatedQuestions
      }));
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      fetchFeedbackData();
    } else {
      setFormConfig({
        feedbackName: '',
        feedbackTitle: '',
        assignedFor: [],
        type: '',
        fields: {
          name: false,
          mobile: false,
          emailId: false,
          age: false
        },
        questions: [{ question: '', type: '' }]
      });
    }
    setError('');
    setSuccess(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const payload = {
        feedbackName: formConfig.feedbackName,
        feedbackTitle: formConfig.feedbackTitle,
        assignedFor: formConfig.assignedFor,
        type: formConfig.type,
        fields: formConfig.fields,
        questions: formConfig.questions
      };

      let response;
      if (isEditMode) {
        response = await axios.put(
          `http://localhost:5000/api/feedback-forms/${id}`,
          payload
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/feedback-forms',
          payload
        );
      }

      setSuccess(true);
      navigate('/');
      
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card ref={ref} className="p-6 bg-white shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {isEditMode ? 'Edit Feedback Form' : 'Feedback Form'}
        </h2>
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="hover:bg-gray-100"
        >
          Back to List
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
          <AlertDescription>Form configuration saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Assigned For <span className="text-red-500">*</span>
            </label>
            <MultiSelect
              options={assignmentOptions}
              value={formConfig.assignedFor}
              onChange={values => handleInputChange('assignedFor', values)}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Feedback Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formConfig.feedbackName}
              onChange={(e) => handleInputChange('feedbackName', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Feedback Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formConfig.feedbackTitle}
              onChange={(e) => handleInputChange('feedbackTitle', e.target.value)}
            />
          </div>
        </div>

        {/* Checkboxes Row */}
        <div className="flex gap-6">
          {['name', 'mobile', 'emailId', 'age'].map((field) => (
            <div key={field} className="flex items-center space-x-2">
              <Checkbox
                id={field}
                checked={formConfig.fields[field]}
                onCheckedChange={() => handleFieldToggle(field)}
              />
              <label htmlFor={field} className="text-sm font-medium capitalize">
                {field === 'emailId' ? 'Email' : field}
              </label>
            </div>
          ))}
        </div>

        {/* Questions Section */}
        {formConfig.questions.map((q, index) => (
          <div key={index} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Question {index + 1} <span className="text-red-500">*</span>
              </label>
              <Input
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={q.type}
                  onValueChange={(value) => handleQuestionChange(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                    <SelectItem value="multiselect">Multi Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(index)}
                disabled={formConfig.questions.length === 1}
                className="mt-8"
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addQuestion}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Add More
        </Button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            variant="default"
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={handleReset}
            variant="destructive"
            className="bg-red-400 hover:bg-red-500 text-white"
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
});

FeedbackFormGenerator.displayName = "FeedbackFormGenerator";

export default FeedbackFormGenerator;