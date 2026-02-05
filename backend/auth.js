const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

const USERS_FILE = path.join(__dirname, "users.json");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "dev_secret_key";

const readUsers = () => {
  try {
    // Create file if missing
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
      return [];
    }

    const data = fs.readFileSync(USERS_FILE, "utf-8");

    if (!data.trim()) return [];

    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read users.json:", err);
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

/* =======================
   REGISTER
======================= */

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password required" });
  }

  const users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  users.push({
    username,
    password: hashedPassword,
  });

  writeUsers(users);

  res.status(201).json({ message: "User registered successfully" });
});

/* =======================
   LOGIN
======================= */

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { username: user.username },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

module.exports = router;
