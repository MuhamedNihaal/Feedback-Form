const express = require('express');
const router = express.Router();
const {
  createFormConfig,
  getFormConfigs,
  getFormConfig,
  updateFormConfig,
  deleteFormConfig,
  toggleActive
} = require('../controllers/formController');

router.route('/')
  .get(getFormConfigs)
  .post(createFormConfig);

router.route('/:id')
  .get(getFormConfig)
  .put(updateFormConfig)
  .delete(deleteFormConfig);

router.route('/:id/toggle-active')
  .patch(toggleActive);

module.exports = router;