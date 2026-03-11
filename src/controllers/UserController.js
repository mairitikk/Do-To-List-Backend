const User = require("../models/User");

const userController = {
  getMe: async (req, res) => {
    try {
      const user = await User.getById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      const { password, confirmationToken, tokenExpiry, ...safeUser } = user;
      res.json(safeUser);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user" });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to get users" });
    }
  },

  getByRole: async (req, res) => {
    try {
      const users = await User.getByRole(req.params.role);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to get users" });
    }
  },

  getByIds: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !ids.length) return res.json([]);
      const users = await User.getByIds(ids);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to get users" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      await User.update(id, req.body);
      const updated = await User.getById(id);
      if (!updated) return res.status(404).json({ error: "User not found" });
      const { password, confirmationToken, tokenExpiry, ...safeUser } = updated;
      res.json(safeUser);
    } catch (err) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  delete: async (req, res) => {
    try {
      await User.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};

module.exports = userController;
