const Visit = {
  create: async (eventId) => {
    const [result] = await db.query(
      "INSERT INTO visits (event_id, timestamp) VALUES (?, ?)",
      [eventId, Date.now()],
    );
    return { id: result.insertId, eventId, timestamp: Date.now() };
  },

  getByEventIds: async (eventIds) => {
    if (!eventIds.length) return [];
    const [rows] = await db.query(
      "SELECT * FROM visits WHERE event_id IN (?)",
      [eventIds],
    );
    return rows.map((r) => ({
      id: r.id,
      eventId: r.event_id,
      timestamp: Number(r.timestamp),
    }));
  },
};

module.exports = Visit;
