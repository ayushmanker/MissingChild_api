const express = require('express');
const router = express.Router();

const { getmchild,
  getmchildren,
  createmchild,
  updatemchild,
  deletemchild,
  mchildPhotoUpload } = require('../controllers/mchild');

  const { protect, authorize } = require('../middleware/auth');

  router.route('/')
  .get(protect, authorize('admin'),getmchildren)
  .post(protect, authorize('user', 'admin'),createmchild);

  router.route('/:id')
  .put(protect, authorize('user', 'admin'),updatemchild)
  .delete(protect, authorize('user', 'admin'),deletemchild)
  .get(protect, authorize('user', 'admin'),getmchild);

  router
  .route('/:id/photo')
  .put(protect, authorize('user', 'admin'),mchildPhotoUpload);


module.exports = router;