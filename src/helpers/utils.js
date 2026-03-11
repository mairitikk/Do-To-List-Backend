const crypto = require("crypto");

const generateId = () => crypto.randomUUID();

const generateToken = () => crypto.randomUUID();

module.exports = { generateId, generateToken };
