const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    eventId: row.event_id,
    url: row.url,
    thumbnailUrl: row.thumbnail_url,
    filename: row.filename,
    price: parseFloat(row.price),
    isWatermarked: !!row.is_watermarked,
  };
};

const Photo = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM photos");
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM photos WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByEvent: async (eventId) => {
    const [rows] = await db.query("SELECT * FROM photos WHERE event_id = ?", [
      eventId,
    ]);
    return rows.map(mapRow);
  },

  countByEventIds: async (eventIds) => {
    if (!eventIds.length) return 0;
    const [rows] = await db.query(
      "SELECT COUNT(*) as count FROM photos WHERE event_id IN (?)",
      [eventIds],
    );
    return rows[0].count;
  },

  create: async (photo) => {
    await db.query(
      "INSERT INTO photos (id, event_id, url, thumbnail_url, filename, price, is_watermarked) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        photo.id,
        photo.eventId,
        photo.url || null,
        photo.thumbnailUrl || null,
        photo.filename || null,
        photo.price || 0,
        photo.isWatermarked ? 1 : 0,
      ],
    );
    return photo;
  },

  bulkCreate: async (photos) => {
    if (!photos.length) return;
    const values = photos.map((p) => [
      p.id,
      p.eventId,
      p.url || null,
      p.thumbnailUrl || null,
      p.filename || null,
      p.price || 0,
      p.isWatermarked ? 1 : 0,
    ]);
    await db.query(
      "INSERT INTO photos (id, event_id, url, thumbnail_url, filename, price, is_watermarked) VALUES ?",
      [values],
    );
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    const mapping = {
      eventId: "event_id",
      url: "url",
      thumbnailUrl: "thumbnail_url",
      filename: "filename",
      price: "price",
      isWatermarked: "is_watermarked",
    };
    for (const [key, col] of Object.entries(mapping)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = ?`);
        values.push(key === "isWatermarked" ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (!fields.length) return;
    values.push(id);
    await db.query(
      `UPDATE photos SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM photos WHERE id = ?", [id]);
  },

  bulkDelete: async (ids) => {
    if (!ids.length) return;
    await db.query("DELETE FROM photos WHERE id IN (?)", [ids]);
  },

  deleteByEventIds: async (eventIds) => {
    if (!eventIds.length) return;
    await db.query("DELETE FROM photos WHERE event_id IN (?)", [eventIds]);
  },
};

module.exports = Photo;
