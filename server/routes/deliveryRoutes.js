const express = require('express');
const router = express.Router();
const { protect, deliveryOnly } = require('../middleware/authMiddleware');
const { getAssignedOrders, updateDeliveryStatus } = require('../controllers/deliveryController');

router.use(protect, deliveryOnly);
router.get('/orders', getAssignedOrders);
router.put('/orders/:id/status', updateDeliveryStatus);

module.exports = router;
