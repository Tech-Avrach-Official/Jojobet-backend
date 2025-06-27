const Popup = require('../models/Popup');

// Get popup status
exports.getPopupStatus = async (req, res) => {
  try {
    let popup = await Popup.findOne();
    if (!popup) {
      popup = await Popup.create({ isEnabled: false });
    }
    res.json({ isEnabled: popup.isEnabled });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update popup status
exports.updatePopupStatus = async (req, res) => {
  try {
    const { isEnabled } = req.body;

    let popup = await Popup.findOne();
    if (!popup) {
      popup = await Popup.create({ isEnabled });
    } else {
      popup.isEnabled = isEnabled;
      await popup.save();
    }

    res.json({ message: 'Popup status updated', isEnabled: popup.isEnabled });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
