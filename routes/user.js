const express = require('express');


const {
  getuser,
  getusers,
  updateuser,
  createuser,
  deleteuser } = require('../controllers/user');

const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize('admin'));

router.route('/')
      .get(getusers)
      .post(createuser);
router.route('/:id')
      .get(getuser)
      .put(updateuser)
      .delete(deleteuser);

module.exports = router;