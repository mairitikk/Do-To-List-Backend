const Gallery = require("../models/Gallery");

const galleryController = {
  getAll: async (req, res) => {
    try {
      const { ownerId } = req.query;
      const galleries = ownerId
        ? await Gallery.getByOwner(ownerId)
        : await Gallery.getAll();
      res.json(galleries);
    } catch (err) {
      res.status(500).json({ error: "Failed to get galleries" });
    }
  },

  getById: async (req, res) => {
    try {
      const gallery = await Gallery.getById(req.params.id);
      if (!gallery) return res.status(404).json({ error: "Gallery not found" });
      res.json(gallery);
    } catch (err) {
      res.status(500).json({ error: "Failed to get gallery" });
    }
  },

  create: async (req, res) => {
    try {
      const gallery = await Gallery.create(req.body);
      res.status(201).json(gallery);
    } catch (err) {
      res.status(500).json({ error: "Failed to create gallery" });
    }
  },

  update: async (req, res) => {
    try {
      await Gallery.update(req.params.id, req.body);
      const updated = await Gallery.getById(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update gallery" });
    }
  },

  delete: async (req, res) => {
    try {
      await Gallery.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete gallery" });
    }
  },
};

module.exports = galleryController;
