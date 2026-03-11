const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    galleryId: row.gallery_id,
    name: row.name,
    date: row.date,
    description: row.description,
    token: row.token,
    expirationDate: row.expiration_date,
    expirationDays: row.expiration_days,
  };
};

const Event = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM events");
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByGallery: async (galleryId) => {
    const [rows] = await db.query("SELECT * FROM events WHERE gallery_id = ?", [
      galleryId,
    ]);
    return rows.map(mapRow);
  },

  getByToken: async (token) => {
    const [rows] = await db.query("SELECT * FROM events WHERE token = ?", [
      token,
    ]);
    return mapRow(rows[0]);
  },

  getByGalleryIds: async (galleryIds) => {
    if (!galleryIds.length) return [];
    const [rows] = await db.query(
      "SELECT * FROM events WHERE gallery_id IN (?)",
      [galleryIds],
    );
    return rows.map(mapRow);
  },

  create: async (event) => {
    await db.query(
      "INSERT INTO events (id, gallery_id, name, date, description, token, expiration_date, expiration_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        event.id,
        event.galleryId,
        event.name,
        event.date || null,
        event.description || null,
        event.token,
        event.expirationDate || null,
        event.expirationDays || null,
      ],
    );
    return event;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    const mapping = {
      galleryId: "gallery_id",
      name: "name",
      date: "date",
      description: "description",
      token: "token",
      expirationDate: "expiration_date",
      expirationDays: "expiration_days",
    };
    for (const [key, col] of Object.entries(mapping)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = ?`);
        values.push(data[key]);
      }
    }
    if (!fields.length) return;
    values.push(id);
    await db.query(
      `UPDATE events SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  },

  cleanupExpired: async () => {
    const [rows] = await db.query(
      "SELECT id FROM events WHERE expiration_date IS NOT NULL AND CAST(expiration_date AS DATETIME) < NOW()",
    );
    if (!rows.length) return 0;
    const ids = rows.map((r) => r.id);
    await db.query("DELETE FROM events WHERE id IN (?)", [ids]);
    return ids.length;
  },
};

module.exports = Event;
