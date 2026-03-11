const Event = require("../models/Event");

const eventController = {
  getAll: async (req, res) => {
    try {
      const { galleryId } = req.query;
      const events = galleryId
        ? await Event.getByGallery(galleryId)
        : await Event.getAll();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to get events" });
    }
  },

  getById: async (req, res) => {
    try {
      const event = await Event.getById(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to get event" });
    }
  },

  getByToken: async (req, res) => {
    try {
      const event = await Event.getByToken(req.params.token);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to get event" });
    }
  },

  getByGalleryIds: async (req, res) => {
    try {
      const { galleryIds } = req.body;
      if (!galleryIds || !galleryIds.length) return res.json([]);
      const events = await Event.getByGalleryIds(galleryIds);
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to get events" });
    }
  },

  create: async (req, res) => {
    try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to create event" });
    }
  },

  update: async (req, res) => {
    try {
      await Event.update(req.params.id, req.body);
      const updated = await Event.getById(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update event" });
    }
  },

  delete: async (req, res) => {
    try {
      await Event.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  },

  cleanup: async (req, res) => {
    try {
      const count = await Event.cleanupExpired();
      res.json({ cleaned: count });
    } catch (err) {
      res.status(500).json({ error: "Cleanup failed" });
    }
  },
};

module.exports = eventController;
