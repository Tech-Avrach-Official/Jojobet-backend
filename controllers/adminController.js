const User = require("../models/User");
const DepositConfig = require("../models/deposit");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    const {
      username,
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      bankAccount,
      ipAdress,
      location,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      role,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      bankAccount,
      ipAdress,
      location,
      password,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = role || user.role;
    await user.save();
    res.json({ message: "User role updated successfully!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const savedeposit = async (req, res) => {
  try {
    const { range80, range20, useFixedAmount, fixedAmount } = req.body;

    // Validate ranges
    if (
      !range80 || isNaN(range80.min) || isNaN(range80.max) ||
      !range20 || isNaN(range20.min) || isNaN(range20.max)
    ) {
      return res.status(400).json({ message: "Range min and max must be valid numbers" });
    }

    // Validate min < max for both ranges
    if (range80.min > range80.max) {
      return res.status(400).json({ message: "range80.min cannot be greater than range80.max" });
    }
    if (range20.min > range20.max) {
      return res.status(400).json({ message: "range20.min cannot be greater than range20.max" });
    }

    // Validate fixed amount if used
    if (useFixedAmount) {
      if (fixedAmount == null || isNaN(fixedAmount) || fixedAmount <= 0) {
        return res.status(400).json({ message: "Fixed amount must be a positive number when useFixedAmount is true" });
      }
    }

    // Prepare data
    const dataToSave = {
      range80: {
        min: Number(range80.min),
        max: Number(range80.max)
      },
      range20: {
        min: Number(range20.min),
        max: Number(range20.max)
      },
      useFixedAmount: Boolean(useFixedAmount),
      fixedAmount: useFixedAmount ? Number(fixedAmount) : undefined
    };
    console.log("Data to save:", dataToSave);
// console.log(DepositConfig)
    // Update existing config or create new one
    const updatedConfig = await DepositConfig.findOneAndUpdate(
      {}, // filter: empty object means update first found or create new
      dataToSave,
      { new: true, upsert: true, runValidators: true }
    );
    console.log("Updated config:", updatedConfig);

    res.status(200).json({
      message: "Deposit configuration saved successfully!",
      data: updatedConfig
    });

  } catch (error) {
    console.error("Error saving deposit config:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = { createUserByAdmin, updateUserRole, deleteUser ,savedeposit};
