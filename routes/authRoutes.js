const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Kontrollera om användarnamn redan finns
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Användarnamnet är redan taget" });

    // Hasha lösenord
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Skapa ny användare
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || "User",
    });
    await newUser.save();

    res.status(201).json({ message: "Användare skapad" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverfel" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

module.exports = router;
