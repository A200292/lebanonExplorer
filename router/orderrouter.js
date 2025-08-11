// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middlewares/authMiddleware"); // to get req.user.id

// Create an order
router.post("/", authMiddleware, orderController.createOrder);

// Get all orders for the logged-in buyer
router.get("/", authMiddleware, orderController.getOrders);

// Get a single order by ID (only if belongs to buyer)
router.get("/:id", authMiddleware, orderController.getOrderById);

// Update order status (seller/admin action)
router.put("/:id/status", authMiddleware, orderController.updateOrderStatus);

// Delete (soft delete) order
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
