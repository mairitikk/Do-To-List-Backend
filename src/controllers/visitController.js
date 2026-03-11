const Visit = require("../models/Visit");

const visitController = {
  record: async (req, res) => {
    try {
      const { eventId } = req.body;
      if (!eventId)
        return res.status(400).json({ error: "eventId is required" });
      const visit = await Visit.create(eventId);
      res.status(201).json(visit);
    } catch (err) {
      res.status(500).json({ error: "Failed to record visit" });
    }
  },

  getByEventIds: async (req, res) => {
    try {
      const { eventIds } = req.body;
      if (!eventIds || !eventIds.length) return res.json([]);
      const visits = await Visit.getByEventIds(eventIds);
      res.json(visits);
    } catch (err) {
      res.status(500).json({ error: "Failed to get visits" });
    }
  },
};

module.exports = visitController;
