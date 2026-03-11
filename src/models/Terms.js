const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    termsOfService: row.terms_of_service,
    privacyPolicy: row.privacy_policy,
    dataProcessingAgreement: row.data_processing_agreement,
    childContentConsent: row.child_content_consent,
    updatedAt: row.updated_at ? Number(row.updated_at) : undefined,
  };
};

const Terms = {
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM terms WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByOwner: async (ownerId) => {
    const [rows] = await db.query("SELECT * FROM terms WHERE owner_id = ?", [
      ownerId,
    ]);
    return mapRow(rows[0]);
  },

  upsert: async (data) => {
    const existing = data.id ? await Terms.getById(data.id) : null;
    if (existing) {
      const fields = [];
      const values = [];
      if (data.termsOfService !== undefined) {
        fields.push("terms_of_service = ?");
        values.push(data.termsOfService);
      }
      if (data.privacyPolicy !== undefined) {
        fields.push("privacy_policy = ?");
        values.push(data.privacyPolicy);
      }
      if (data.dataProcessingAgreement !== undefined) {
        fields.push("data_processing_agreement = ?");
        values.push(data.dataProcessingAgreement);
      }
      if (data.childContentConsent !== undefined) {
        fields.push("child_content_consent = ?");
        values.push(data.childContentConsent);
      }
      fields.push("updated_at = ?");
      values.push(data.updatedAt || Date.now());
      values.push(data.id);
      await db.query(
        `UPDATE terms SET ${fields.join(", ")} WHERE id = ?`,
        values,
      );
      return { ...existing, ...data };
    }
    const [result] = await db.query(
      "INSERT INTO terms (owner_id, terms_of_service, privacy_policy, data_processing_agreement, child_content_consent, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data.ownerId || null,
        data.termsOfService || "",
        data.privacyPolicy || "",
        data.dataProcessingAgreement || "",
        data.childContentConsent || "",
        data.updatedAt || Date.now(),
      ],
    );
    return { ...data, id: result.insertId };
  },
};

module.exports = Terms;
