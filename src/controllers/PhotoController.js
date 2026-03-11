const path = require("path");
const fs = require("fs");
const Photo = require("../models/Photo");
const { generateId } = require("../helpers/utils");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const photoController = {
  getByEvent: async (req, res) => {
    try {
      const photos = await Photo.getByEvent(req.params.eventId);
      res.json(photos);
    } catch (err) {
      res.status(500).json({ error: "Failed to get photos" });
    }
  },

  getAll: async (req, res) => {
    try {
      const photos = await Photo.getAll();
      res.json(photos);
    } catch (err) {
      res.status(500).json({ error: "Failed to get photos" });
    }
  },

  countByEventIds: async (req, res) => {
    try {
      const { eventIds } = req.body;
      if (!eventIds || !eventIds.length) return res.json({ count: 0 });
      const count = await Photo.countByEventIds(eventIds);
      res.json({ count });
    } catch (err) {
      res.status(500).json({ error: "Failed to count photos" });
    }
  },

  upload: async (req, res) => {
    try {
      const { eventId } = req.body;
      if (!eventId)
        return res.status(400).json({ error: "eventId is required" });

      const files = req.files;
      if (!files || !files.length)
        return res.status(400).json({ error: "No files uploaded" });

      const price = parseFloat(req.body.price) || 0;
      const isWatermarked = req.body.isWatermarked === "true";
      const photos = [];

      for (const file of files) {
        const photo = {
          id: generateId(),
          eventId,
          url: `/uploads/${file.filename}`,
          thumbnailUrl: `/uploads/${file.filename}`,
          filename: file.originalname,
          price,
          isWatermarked,
        };
        photos.push(photo);
      }

      await Photo.bulkCreate(photos);
      res.status(201).json(photos);
    } catch (err) {
      console.error("Photo upload error:", err);
      res.status(500).json({ error: "Failed to upload photos" });
    }
  },

  bulkCreate: async (req, res) => {
    try {
      const { photos } = req.body;
      if (!photos || !photos.length)
        return res.status(400).json({ error: "No photos provided" });
      await Photo.bulkCreate(photos);
      res.status(201).json(photos);
    } catch (err) {
      res.status(500).json({ error: "Failed to create photos" });
    }
  },

  update: async (req, res) => {
    try {
      await Photo.update(req.params.id, req.body);
      const updated = await Photo.getById(req.params.id);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update photo" });
    }
  },

  delete: async (req, res) => {
    try {
      await Photo.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  },

  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !ids.length)
        return res.status(400).json({ error: "No IDs provided" });
      await Photo.bulkDelete(ids);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete photos" });
    }
  },

  deleteByEventIds: async (req, res) => {
    try {
      const { eventIds } = req.body;
      if (!eventIds || !eventIds.length)
        return res.status(400).json({ error: "No event IDs" });
      await Photo.deleteByEventIds(eventIds);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete photos" });
    }
  },
};

module.exports = photoController;
