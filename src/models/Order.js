const mapRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    customerEmail: row.customer_email,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    total: parseFloat(row.total),
    date: row.date,
    status: row.status,
  };
};

const Order = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY date DESC");
    return rows.map(mapRow);
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);
    return mapRow(rows[0]);
  },

  getByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE customer_email = ? ORDER BY date DESC",
      [email],
    );
    return rows.map(mapRow);
  },

  create: async (order) => {
    await db.query(
      "INSERT INTO orders (id, user_id, customer_email, items, total, date, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        order.id,
        order.userId || null,
        order.customerEmail,
        JSON.stringify(order.items),
        order.total,
        order.date,
        order.status || "completed",
      ],
    );
    return order;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];
    if (data.status !== undefined) {
      fields.push("status = ?");
      values.push(data.status);
    }
    if (data.customerEmail !== undefined) {
      fields.push("customer_email = ?");
      values.push(data.customerEmail);
    }
    if (data.items !== undefined) {
      fields.push("items = ?");
      values.push(JSON.stringify(data.items));
    }
    if (data.total !== undefined) {
      fields.push("total = ?");
      values.push(data.total);
    }
    if (!fields.length) return;
    values.push(id);
    await db.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  },

  delete: async (id) => {
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
  },
};

module.exports = Order;
