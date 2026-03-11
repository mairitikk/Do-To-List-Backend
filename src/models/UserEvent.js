const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    eventId: row.event_id,
    assignedAt: Number(row.assigned_at),
  };
};

const UserEvent = {
  getByUser: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM user_events WHERE user_id = ?",
      [userId],
    );
    return rows.map(mapRow);
  },

  getByEventIds: async (eventIds) => {
    if (!eventIds.length) return [];
    const [rows] = await db.query(
      "SELECT * FROM user_events WHERE event_id IN (?)",
      [eventIds],
    );
    return rows.map(mapRow);
  },

  getByUserAndEvent: async (userId, eventId) => {
    const [rows] = await db.query(
      "SELECT * FROM user_events WHERE user_id = ? AND event_id = ?",
      [userId, eventId],
    );
    return mapRow(rows[0]);
  },

  create: async (userId, eventId) => {
    const [result] = await db.query(
      "INSERT IGNORE INTO user_events (user_id, event_id, assigned_at) VALUES (?, ?, ?)",
      [userId, eventId, Date.now()],
    );
    return { id: result.insertId, userId, eventId, assignedAt: Date.now() };
  },

  bulkDelete: async (ids) => {
    if (!ids.length) return;
    await db.query("DELETE FROM user_events WHERE id IN (?)", [ids]);
  },

  deleteByUser: async (userId) => {
    await db.query("DELETE FROM user_events WHERE user_id = ?", [userId]);
  },
};

module.exports = UserEvent;
