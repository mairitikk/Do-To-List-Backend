const Terms = require("../models/Terms");

const termsController = {
  get: async (req, res) => {
    try {
      const id = req.params.id || 1;
      const terms = await Terms.getById(id);
      if (!terms) return res.status(404).json({ error: "Terms not found" });
      res.json(terms);
    } catch (err) {
      res.status(500).json({ error: "Failed to get terms" });
    }
  },

  save: async (req, res) => {
    try {
      const result = await Terms.upsert(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to save terms" });
    }
  },
};

module.exports = termsController;
