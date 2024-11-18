const FormConfig = require('../models/FormConfig');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.createFormConfig = asyncHandler(async (req, res) => {
  const formData = {
    name: req.body.feedbackName,
    title: req.body.feedbackTitle,
    type: req.body.type,
    assignedFor: req.body.assignedFor,
    fields: req.body.fields,
    questions: req.body.questions,
    active: req.body.active || false,
    isDefault: req.body.isDefault || false
  };

  const formConfig = await FormConfig.create(formData);
  res.status(201).json({
    success: true,
    data: formConfig
  });
}); // Added closing bracket here for createFormConfig function

exports.getFormConfigs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  // Build search query
  const searchQuery = search
    ? { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { formLink: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  // Execute query with pagination and search
  const total = await FormConfig.countDocuments(searchQuery);
  const feedbacks = await FormConfig.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // If export is requested, return all records
  if (req.query.export === 'true') {
    const allFeedbacks = await FormConfig.find(searchQuery).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      feedbacks: allFeedbacks
    });
  }

  res.status(200).json({
    success: true,
    total,
    feedbacks
  });
});

exports.updateFormConfig = asyncHandler(async (req, res) => {
  const updateData = {
    name: req.body.feedbackName,
    title: req.body.feedbackTitle,
    type: req.body.type,
    assignedFor: req.body.assignedFor,
    fields: req.body.fields,
    questions: req.body.questions,
    active: req.body.active || false,
    isDefault: req.body.isDefault || false
  };

  const formConfig = await FormConfig.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!formConfig) {
    throw new ErrorResponse('Form configuration not found', 404);
  }

  res.status(200).json({
    success: true,
    data: formConfig
  });
});

exports.toggleActive = asyncHandler(async (req, res) => {
  const formConfig = await FormConfig.findById(req.params.id);
  
  if (!formConfig) {
    throw new ErrorResponse('Form configuration not found', 404);
  }

  formConfig.active = !formConfig.active;
  formConfig.modifiedBy = 'Admin 1'; // You might want to get this from auth context
  await formConfig.save();

  res.status(200).json({
    success: true,
    data: formConfig
  });
});

exports.getFormConfig = asyncHandler(async (req, res) => {
  const formConfig = await FormConfig.findById(req.params.id);
  
  if (!formConfig) {
    throw new ErrorResponse('Form configuration not found', 404);
  }

  res.status(200).json({
    success: true,
    data: formConfig
  });
});

// Delete a specific form configuration by ID
exports.deleteFormConfig = asyncHandler(async (req, res) => {
  const formConfig = await FormConfig.findById(req.params.id);

  if (!formConfig) {
    throw new ErrorResponse('Form configuration not found', 404);
  }

  await formConfig.deleteOne({_id: req.params.id});

  res.status(200).json({
    success: true,
    message: 'Form configuration deleted successfully',
  });
});
