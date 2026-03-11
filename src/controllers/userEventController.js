const UserEvent = require("../models/UserEvent");

const userEventController = {
  getByUser: async (req, res) => {
    try {
      const links = await UserEvent.getByUser(req.params.userId);
      res.json(links);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user events" });
    }
  },

  getByEventIds: async (req, res) => {
    try {
      const { eventIds } = req.body;
      if (!eventIds || !eventIds.length) return res.json([]);
      const links = await UserEvent.getByEventIds(eventIds);
      res.json(links);
    } catch (err) {
      res.status(500).json({ error: "Failed to get user events" });
    }
  },

  check: async (req, res) => {
    try {
      const { userId, eventId } = req.query;
      if (!userId || !eventId)
        return res.status(400).json({ error: "userId and eventId required" });
      const link = await UserEvent.getByUserAndEvent(userId, eventId);
      res.json(link);
    } catch (err) {
      res.status(500).json({ error: "Failed to check user event" });
    }
  },

  create: async (req, res) => {
    try {
      const { userId, eventId } = req.body;
      if (!userId || !eventId)
        return res.status(400).json({ error: "userId and eventId required" });
      const link = await UserEvent.create(userId, eventId);
      res.status(201).json(link);
    } catch (err) {
      res.status(500).json({ error: "Failed to create user event link" });
    }
  },

  bulkDelete: async (req, res) => {
    try {
      const { ids } = req.body;
      if (!ids || !ids.length)
        return res.status(400).json({ error: "No IDs provided" });
      await UserEvent.bulkDelete(ids);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user events" });
    }
  },
};

module.exports = userEventController;
