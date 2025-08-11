// controllers/cartController.js

const Cart = require("../modules/cartSchema");
const Order = require("../modules/orderSchema");

// Helper function to send a success response
const successResponse = (res, data, statusCode = 200, message = "") => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Helper function to send an error response
const failedResponse = (res, statusCode = 500, message = "") => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

// Create a new cart
exports.createCart = async (req, res) => {
  try {
    const { cartId, buyerId, items, appliedDiscountId, tenantId } = req.body;

    // Check if buyer already has a cart
    const existingCart = await Cart.findOne({ buyerId, isDeleted: false });
    if (existingCart) {
      return failedResponse(res, 400, "Buyer already has a cart");
    }

    // Create a new cart object
    const newCart = new Cart({
      cartId,
      buyerId,
      items,
      appliedDiscountId,
      tenantId,
      updatedAt: Date.now(),
    });

    // Save to the database
    const savedCart = await newCart.save();

    // Return success
    return successResponse(res, savedCart, 201, "Cart created successfully");
  } catch (err) {
    console.error(err);
    return failedResponse(res, 500, "Unexpected server error");
  }
};

// Add item(s) to cart (merges quantities if item exists)
exports.addToCart = async (req, res) => {
  try {
    const { buyerId, items: newItems } = req.body;

    if (!Array.isArray(newItems) || newItems.length === 0) {
      return failedResponse(res, 400, "Items array is required and cannot be empty");
    }

    // Find the buyer's active cart
    const cart = await Cart.findOne({ buyerId, isDeleted: false });
    if (!cart) {
      return failedResponse(res, 404, "Cart not found");
    }

    // For each new item, merge or add
    newItems.forEach(newItem => {
      const existingItem = cart.items.find(item => {
        // Match by offeringId and slotId (or null)
        const sameOffering = item.offeringId.toString() === newItem.offeringId;
        const sameSlot = (item.slotId ? item.slotId
        .toString() : null) === (newItem.slotId || null);
        return sameOffering && sameSlot;
      });

      if (existingItem) {
        // If item exists, increase quantity
        existingItem.quantity += newItem.quantity;
      } else {
        // Else push new item
        cart.items.push({
          offeringId: newItem.offeringId,
          quantity: newItem.quantity,
          slotId: newItem.slotId || null,
        });
      }
    });

    // Update updatedAt timestamp
    cart.updatedAt = Date.now();

    // Save cart
    const updatedCart = await cart.save();

    return successResponse(res, updatedCart, 200, "Items added to cart successfully");
  } catch (err) {
    console.error(err);
    return failedResponse(res, 500, "Unexpected server error");
  }
};
