const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    defaultPrice: parseFloat(row.default_price),
    enableCreditCard: !!row.enable_credit_card,
    enablePayPal: !!row.enable_paypal,
    paypalClientId: row.paypal_client_id,
    brandColor: row.brand_color,
    headerBg: row.header_bg,
    footerBg: row.footer_bg,
    accentColor: row.accent_color,
    fussballDeToken: row.fussball_de_token,
    branchName: row.branch_name,
    instagramUrl: row.instagram_url,
    backgroundImageUrl: row.background_image_url,
    logoUrl: row.logo_url,
  };
};

const Settings = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM settings");
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM settings WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByOwner: async (ownerId) => {
    const [rows] = await db.query("SELECT * FROM settings WHERE owner_id = ?", [
      ownerId,
    ]);
    return mapRow(rows[0]);
  },

  getByBranch: async (branchName) => {
    const [rows] = await db.query(
      "SELECT * FROM settings WHERE LOWER(branch_name) = LOWER(?)",
      [branchName],
    );
    return mapRow(rows[0]);
  },

  create: async (settings) => {
    const [result] = await db.query(
      `INSERT INTO settings (owner_id, default_price, enable_credit_card, enable_paypal, paypal_client_id,
        brand_color, header_bg, footer_bg, accent_color, fussball_de_token, branch_name,
        instagram_url, background_image_url, logo_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        settings.ownerId || null,
        settings.defaultPrice || 10,
        settings.enableCreditCard ? 1 : 0,
        settings.enablePayPal ? 1 : 0,
        settings.paypalClientId || null,
        settings.brandColor || null,
        settings.headerBg || null,
        settings.footerBg || null,
        settings.accentColor || null,
        settings.fussballDeToken || null,
        settings.branchName || null,
        settings.instagramUrl || null,
        settings.backgroundImageUrl || null,
        settings.logoUrl || null,
      ],
    );
    return { ...settings, id: result.insertId };
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    const mapping = {
      ownerId: "owner_id",
      defaultPrice: "default_price",
      enableCreditCard: "enable_credit_card",
      enablePayPal: "enable_paypal",
      paypalClientId: "paypal_client_id",
      brandColor: "brand_color",
      headerBg: "header_bg",
      footerBg: "footer_bg",
      accentColor: "accent_color",
      fussballDeToken: "fussball_de_token",
      branchName: "branch_name",
      instagramUrl: "instagram_url",
      backgroundImageUrl: "background_image_url",
      logoUrl: "logo_url",
    };
    for (const [key, col] of Object.entries(mapping)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = ?`);
        const val =
          key === "enableCreditCard" || key === "enablePayPal"
            ? data[key]
              ? 1
              : 0
            : data[key];
        values.push(val);
      }
    }
    if (!fields.length) return;
    values.push(id);
    await db.query(
      `UPDATE settings SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  upsert: async (data) => {
    const existing = data.id ? await Settings.getById(data.id) : null;
    if (existing) {
      await Settings.update(data.id, data);
      return { ...existing, ...data };
    }
    return await Settings.create(data);
  },
};

module.exports = Settings;
