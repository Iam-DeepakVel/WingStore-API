const express = require('express')
const router = express.Router()

const {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController')

const {authenticateUser} = require('../middleware/authentication')

router.route('/').get(getAllReview).post(authenticateUser,createReview)
router.route('/:id').get(getSingleReview).patch(authenticateUser,updateReview).delete(authenticateUser,deleteReview)

module.exports = router