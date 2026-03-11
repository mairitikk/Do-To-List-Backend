const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    ownerId: row.owner_id,
    logoUrl: row.logo_url,
  };
};

const Gallery = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM galleries");
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM galleries WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByOwner: async (ownerId) => {
    const [rows] = await db.query(
      "SELECT * FROM galleries WHERE owner_id = ?",
      [ownerId],
    );
    return rows.map(mapRow);
  },

  create: async (gallery) => {
    await db.query(
      "INSERT INTO galleries (id, name, description, owner_id, logo_url) VALUES (?, ?, ?, ?, ?)",
      [
        gallery.id,
        gallery.name,
        gallery.description || null,
        gallery.ownerId,
        gallery.logoUrl || null,
      ],
    );
    return gallery;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    const mapping = {
      name: "name",
      description: "description",
      ownerId: "owner_id",
      logoUrl: "logo_url",
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
      `UPDATE galleries SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM galleries WHERE id = ?", [id]);
  },
};

module.exports = Gallery;
