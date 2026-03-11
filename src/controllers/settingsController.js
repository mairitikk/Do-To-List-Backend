const Settings = require("../models/Settings");

const settingsController = {
  getAll: async (req, res) => {
    try {
      const settings = await Settings.getAll();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  },

  getById: async (req, res) => {
    try {
      const settings = await Settings.getById(req.params.id);
      if (!settings)
        return res.status(404).json({ error: "Settings not found" });
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  },

  getByOwner: async (req, res) => {
    try {
      const settings = await Settings.getByOwner(req.params.ownerId);
      if (!settings)
        return res.status(404).json({ error: "Settings not found" });
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  },

  getByBranch: async (req, res) => {
    try {
      const settings = await Settings.getByBranch(req.params.branchName);
      if (!settings) return res.status(404).json({ error: "Branch not found" });
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  },

  save: async (req, res) => {
    try {
      const result = await Settings.upsert(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to save settings" });
    }
  },

  update: async (req, res) => {
    try {
      await Settings.update(req.params.id, req.body);
      const updated = await Settings.getById(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  },
};

module.exports = settingsController;
