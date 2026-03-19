const TodoModel = require("../models/todo.model");
const jsonwebtoken = require("jsonwebtoken");

// Extract user id from JWT token
const getUserIdFromToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return null;
  const decoded = jsonwebtoken.verify(
    token,
    process.env.JWT_SECRET || "secret_key",
  );
  return decoded.id;
};

const getAlltodos = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ fatal: "Unauthorized" });

    const [result] = await TodoModel.selectAllTodosByUserId(userId);
    res.json(result);
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

const gettodoById = async (req, res) => {
  try {
    const { todoId } = req.params;
    const [result] = await TodoModel.selectTodoById(todoId);
    res.json(result[0]);
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

const createtodo = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ fatal: "Unauthorized" });

    const { title } = req.body;
    const [result] = await TodoModel.insertTodo({ title, user_id: userId });
    const [todo] = await TodoModel.selectTodoById(result.insertId);
    res.status(201).json(todo[0]);
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

const updatetodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title, completed } = req.body;
    await TodoModel.updateTodo(todoId, { title, completed });
    const [todo] = await TodoModel.selectTodoById(todoId);
    res.json(todo[0]);
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

const deletetodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const [result] = await TodoModel.deleteTodo(todoId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ fatal: "Todo not found" });
    }
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.json({ fatal: error.message });
  }
};

// Stubs for routes that exist but aren't needed yet
const getAlltodosPagination = (req, res) => res.json([]);
const gettodoByIdUserAllData = (req, res) => res.json({});
const getAlltodosByState = (req, res) => res.json([]);
const gettodoByUserId = (req, res) => res.json([]);

module.exports = {
  getAlltodos,
  gettodoById,
  createtodo,
  updatetodo,
  deletetodo,
  getAlltodosPagination,
  gettodoByIdUserAllData,
  getAlltodosByState,
  gettodoByUserId,
};
