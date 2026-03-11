const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateId, generateToken } = require("../helpers/utils");
const { generateToken: generateJWT } = require("../middlewares/auth");
const { sendConfirmationEmail } = require("../helpers/mail");

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, branchName } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const existing = await User.getByEmail(email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const confirmationToken = generateToken();
      const user = {
        id: generateId(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "user",
        emailConfirmed: false,
        confirmationToken,
        tokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
        createdAt: Date.now(),
      };

      await User.create(user);

      // Send confirmation email (non-blocking)
      const baseUrl =
        req.body.baseUrl || process.env.FRONTEND_URL || "http://localhost:5173";
      sendConfirmationEmail(
        user.email,
        confirmationToken,
        baseUrl,
        branchName,
      ).catch((err) => {
        console.error("Failed to send confirmation email:", err.message);
      });

      res
        .status(201)
        .json({
          success: true,
          message: "Registration successful. Please check your email.",
        });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await User.getByEmail(email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (user.role === "user" && !user.emailConfirmed) {
        return res.status(403).json({ error: "unconfirmed" });
      }

      const token = generateJWT(user);
      const {
        password: _,
        confirmationToken: __,
        tokenExpiry: ___,
        ...safeUser
      } = user;
      res.json({ token, user: safeUser });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  },

  confirmEmail: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const user = await User.getByConfirmationToken(token);
      if (!user) {
        return res.status(404).json({ error: "Invalid token" });
      }

      if (user.tokenExpiry && Date.now() > user.tokenExpiry) {
        return res.status(410).json({ error: "Token expired" });
      }

      await User.update(user.id, {
        emailConfirmed: true,
        confirmationToken: null,
        tokenExpiry: null,
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Confirm email error:", err);
      res.status(500).json({ error: "Confirmation failed" });
    }
  },
};

module.exports = authController;
