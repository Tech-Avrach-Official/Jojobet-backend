const express = require("express");
const Winner = require("../models/Winner");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });

const router = express.Router();

// ✅ Add Winner
router.post("/", upload.single("userImage"), async (req, res) => {
  try {
    const { userName, winningAmount, gameName } = req.body;

    const newWinner = new Winner({
      userName,
      userImage: req.file.path,
      winningAmount,
      gameName,
    });

    const savedWinner = await newWinner.save();
    res.status(201).json(savedWinner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Winners
router.get("/", async (req, res) => {
  try {
    const winners = await Winner.find().sort({ createdAt: -1 });
    res.json(winners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Winner
router.put("/:id", upload.single("userImage"), async (req, res) => {
  try {
    const updateData = {
      userName: req.body.userName,
      winningAmount: req.body.winningAmount,
      gameName: req.body.gameName,
    };

    if (req.file) {
      updateData.userImage = req.file.path;
    }

    const updatedWinner = await Winner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedWinner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete One Winner
router.delete("/:id", async (req, res) => {
  try {
    await Winner.findByIdAndDelete(req.params.id);
    res.json({ message: "Winner deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete All Winners
router.delete("/", async (req, res) => {
  try {
    await Winner.deleteMany({});
    res.json({ message: "All winners deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
