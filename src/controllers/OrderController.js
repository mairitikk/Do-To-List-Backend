const Order = require("../models/Order");

const orderController = {
  getAll: async (req, res) => {
    try {
      const orders = await Order.getAll();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  },

  getById: async (req, res) => {
    try {
      const order = await Order.getById(req.params.id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to get order" });
    }
  },

  getByEmail: async (req, res) => {
    try {
      const orders = await Order.getByEmail(req.params.email);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  },

  create: async (req, res) => {
    try {
      const order = await Order.create(req.body);
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: "Failed to create order" });
    }
  },

  update: async (req, res) => {
    try {
      await Order.update(req.params.id, req.body);
      const updated = await Order.getById(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update order" });
    }
  },

  delete: async (req, res) => {
    try {
      await Order.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete order" });
    }
  },
};

module.exports = orderController;
