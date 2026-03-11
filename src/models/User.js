const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    name: row.name,
    address: row.address,
    role: row.role,
    emailConfirmed: !!row.email_confirmed,
    confirmationToken: row.confirmation_token,
    tokenExpiry: row.token_expiry ? Number(row.token_expiry) : undefined,
    createdAt: Number(row.created_at),
  };
};

const User = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT id, email, name, address, role, email_confirmed, created_at FROM users",
    );
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return mapRow(rows[0]);
  },

  getByRole: async (role) => {
    const [rows] = await db.query(
      "SELECT id, email, name, address, role, email_confirmed, created_at FROM users WHERE role = ?",
      [role],
    );
    return rows.map(mapRow);
  },

  getByIds: async (ids) => {
    if (!ids.length) return [];
    const [rows] = await db.query(
      "SELECT id, email, name, address, role, email_confirmed, created_at FROM users WHERE id IN (?)",
      [ids],
    );
    return rows.map(mapRow);
  },

  getByConfirmationToken: async (token) => {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE confirmation_token = ?",
      [token],
    );
    return mapRow(rows[0]);
  },

  create: async (user) => {
    await db.query(
      "INSERT INTO users (id, email, password, name, address, role, email_confirmed, confirmation_token, token_expiry, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.id,
        user.email,
        user.password,
        user.name || null,
        user.address || null,
        user.role,
        user.emailConfirmed ? 1 : 0,
        user.confirmationToken || null,
        user.tokenExpiry || null,
        user.createdAt,
      ],
    );
    return user;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    const mapping = {
      email: "email",
      password: "password",
      name: "name",
      address: "address",
      role: "role",
      emailConfirmed: "email_confirmed",
      confirmationToken: "confirmation_token",
      tokenExpiry: "token_expiry",
    };
    for (const [key, col] of Object.entries(mapping)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = ?`);
        values.push(key === "emailConfirmed" ? (data[key] ? 1 : 0) : data[key]);
      }
    }
    if (!fields.length) return;
    values.push(id);
    await db.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
  },
};

module.exports = User;
