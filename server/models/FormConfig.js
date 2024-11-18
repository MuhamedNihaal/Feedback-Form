const mongoose = require('mongoose');

const FormConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Feedback name is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Feedback title is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['branch', 'department', 'division'],
  },
  assignedFor: [{
    type: String,
    required: [true, 'At least one assignment is required']
  }],
  active: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  formLink: {
    type: String,
    unique: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'number', 'select', 'multiselect']
    }
  }],
  fields: {
    name: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    emailId: { type: Boolean, default: false },
    age: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    default: { type: Boolean, default: false },
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual properties for frontend compatibility
FormConfigSchema.virtual('createdDate').get(function() {
  return this.createdAt;
});

FormConfigSchema.virtual('modifiedDate').get(function() {
  return this.updatedAt;
});

// Generate unique form link before saving
FormConfigSchema.pre('save', async function(next) {
  if (!this.formLink) {
    this.formLink = `FORM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('FormConfig', FormConfigSchema);