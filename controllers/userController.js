const User = require("../models/User");

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Användare hittades inte" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "Användaren togs bort" });
  } catch (error) {
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte hämta användare" });
  }
};

module.exports = { deleteUser, getAllUsers };
