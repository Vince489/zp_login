const express = require("express");
const router = express.Router();
const User = require("../user/model");
const GamerTag = require("./model");
const verifyToken = require('../../middleware/auth');

// POST endpoint to add a gamer tag
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user._id is correctly set by verifyToken middleware
    const gamerTagName = req.body.gamerTag; // Assuming gamerTag name is sent in the request body

    // Find or create the GamerTag document
    let gamerTag = await GamerTag.findOne({ gamerTag: gamerTagName });
    if (!gamerTag) {
      gamerTag = await GamerTag.create({ gamerTag: gamerTagName });
    }

    // Find the user by ID and update the gamerTags array with the ObjectId of the GamerTag
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { gamerTags: gamerTag._id } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated user object
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user object with the added gamer tag
    res.status(200).json({ message: 'Gamer tag added successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
