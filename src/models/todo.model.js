const selectAllTodosByUserId = (userId) => {
  return db.query("SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC", [
    userId,
  ]);
};

const selectTodoById = (id) => {
  return db.query("SELECT * FROM todos WHERE id = ?", [id]);
};

const insertTodo = ({ title, user_id }) => {
  return db.query("INSERT INTO todos (title, user_id) VALUES (?, ?)", [
    title,
    user_id,
  ]);
};

const updateTodo = (id, { title, completed }) => {
  return db.query("UPDATE todos SET title = ?, completed = ? WHERE id = ?", [
    title,
    completed,
    id,
  ]);
};

const deleteTodo = (id) => {
  return db.query("DELETE FROM todos WHERE id = ?", [id]);
};

module.exports = {
  selectAllTodosByUserId,
  selectTodoById,
  insertTodo,
  updateTodo,
  deleteTodo,
};
