const jwt = require("jsonwebtoken");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");
require("dotenv").config();
const DepositConfig = require('../models/deposit');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      role,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const username = `${firstName}${lastName}${Date.now()}`;

    let randomBalance;

    // if (Math.random() < 0.8) {
    //   // 80% chance: balance between 3000 and 5000 TL
    //   randomBalance = parseFloat(
    //     (Math.random() * (10000 - 1000) + 10000).toFixed(2)
    //   );
    // } else {
    //   // 20% chance: balance between 0.2 and 5 TL
    //   randomBalance = parseFloat((Math.random() * (10000 - 10000) + 10000).toFixed(2));
    // }

        let depositData = await DepositConfig.findOne({}); // Fetch deposit data from the database
    if (!depositData) {
      console.warn("DepositConfig not found, using default deposit ranges");
      depositData = {
        useFixedAmount: false,
        fixedAmount: 4000,
        range80: { min: 3000, max: 5000 },
        range20: { min: 0.2, max: 5 },
      }
    }
    console.log("Deposit Data:", depositData.range80.max);

    if (depositData.useFixedAmount) {
      randomBalance = depositData.fixedAmount;
    } 
    
    else {

      if (Math.random() < 0.8) {
        // 80% chance: balance between 3000 and 5000 TL
        randomBalance = parseFloat(
          (Math.random() * (depositData.range80.max - depositData.range80.min) + depositData.range80.min).toFixed(2)
        );
      } else {
        // 20% chance: balance between 0.2 and 5 TL
        randomBalance = parseFloat((Math.random() * (depositData.range20.max - depositData.range20.min) + depositData.range20.min).toFixed(2));
      }

    }

    const ipAdress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("🔹 User IP Address:", ipAdress);

    let status;
    if (["finance", "financeAdmin", "user"].includes(role)) {
      status = "pending";
    } else if (role === "admin") {
      status = "approved";
    } else {
      status = "pending";
    }

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      role,
      ipAdress: ipAdress,
      bankAccount: randomBalance,
      status: status,
    });

    const token = generateToken(user._id);

    res.status(201).json({ message: "Registered Successfully!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginOrAutoRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        if (user.role === "finance" && user.status === "pending") {
          return res.status(400).json({
            message: "Your account is pending approval by the admin.",
          });
        }

        const token = generateToken(user._id);
        return res
          .status(200)
          .json({ message: "Login successful", token, user });
      } else {
        return res.status(400).json({ message: "Invalid email or password" });
      }
    }

    // Auto-register new user with random details
    const randomNum = Math.floor(Math.random() * 1000000);
    const firstName = "Auto";
    const lastName = `User${randomNum}`;
    const username = `${firstName}${lastName}`;
    let randomBalance;

    // if (Math.random() < 0.8) {
    //   // 80% chance: balance between 3000 and 5000 TL
    //   randomBalance = parseFloat(
    //     (Math.random() * (10000 - 10000) + 10000).toFixed(2)
    //   );
    // } else {
    //   // 20% chance: balance between 0.2 and 5 TL
    //   randomBalance = parseFloat((Math.random() * (10000 - 10000) + 10000).toFixed(2));
    // }

        let depositData = await DepositConfig.findOne({}); // Fetch deposit data from the database

      
    if (!depositData) {

      
        console.warn("DepositConfig not found, using default deposit ranges");
        depositData = {
          useFixedAmount: false,
          fixedAmount: 4000,
          range80: { min: 3000, max: 5000 },
          range20: { min: 0.2, max: 5 },
        }

      // return res.status(500).json({ message: "Deposit configuration not found" });
    }
    console.log("Deposit Data:", depositData.range80.max);

    if (depositData.useFixedAmount) {
      randomBalance = depositData.fixedAmount;
    } 
    
    else {

      if (Math.random() < 0.8) {
        // 80% chance: balance between 3000 and 5000 TL
        randomBalance = parseFloat(
          (Math.random() * (depositData.range80.max - depositData.range80.min) + depositData.range80.min).toFixed(2)
        );
      } else {
        // 20% chance: balance between 0.2 and 5 TL
        randomBalance = parseFloat((Math.random() * (depositData.range20.max - depositData.range20.min) + depositData.range20.min).toFixed(2));
      }

    }

    const ipAdress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("🔹 User IP Address:", ipAdress);

    const role = "user"; // or any default role you want
    const status = "approved";

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      ipAdress: ipAdress,
      bankAccount: randomBalance,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "New user auto-registered and logged in.",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if finance user or financeAdmin is approved or not?
    if (
      ["finance", "financeAdmin"].includes(user.role) &&
      user.status === "pending"
    ) {
      return res
        .status(400)
        .json({ message: "Your account is pending approval by the admin." });
    }

    const token = generateToken(user._id);

    // Create a login log entry
    const loginLog = new LoginLog({
      user: user._id,
    });

    await loginLog.save();

    res.json({ message: "Login successfully!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logout successful" });
  });
};

const getUserProfile = (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
};

const approveFinanceUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!["finance", "financeAdmin"].includes(user.role))
      return res.status(400).json({ message: "Not a finance user" });

    user.status = user.status === "approved" ? "pending" : "approved";
    await user.save();

    res.status(200).json({
      message: `User status updated to '${user.status}' successfully!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFinanceUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["finance", "financeAdmin"] },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(now.getDate() - 6); // Last 7 days including today
    startOfLastWeek.setHours(0, 0, 0, 0);

    const startOfLastMonth = new Date();
    startOfLastMonth.setDate(now.getDate() - 29); // Last 30 days including today
    startOfLastMonth.setHours(0, 0, 0, 0);

    const startOfLastYear = new Date();
    startOfLastYear.setDate(now.getDate() - 364); // Last 365 days including today
    startOfLastYear.setHours(0, 0, 0, 0);

    const endOfNow = new Date(); // Current moment

    // Get TOTAL counts for all users (not time-period specific)
    const [totalRegisteredUsers, totalLoggedUsers] = await Promise.all([
      User.countDocuments({ role: "user" }),
      LoginLog.distinct("user").then((ids) => ids.length),
    ]);

    const buildStats = async (startDate, endDate) => {
      const [registeredUsers, loginUserIds] = await Promise.all([
        User.find({
          createdAt: { $gte: startDate, $lte: endDate },
          role: "user",
        }).select("firstName lastName email createdAt"),
        LoginLog.distinct("user", {
          loginAt: { $gte: startDate, $lte: endDate },
        }),
      ]);

      const loggedInUsers = await User.find({
        _id: { $in: loginUserIds },
        role: "user",
      }).select("firstName lastName email createdAt");

      return {
        totalRegisteredUsers: registeredUsers.length,
        totalLoggedUsers: loggedInUsers.length,
        registeredUsers,
        loggedInUsers,
        registeredUserCount: registeredUsers.length,
        loggedInUserCount: loggedInUsers.length,
      };
    };

    const [today, yesterday, lastWeek, lastMonth, lastYear] = await Promise.all(
      [
        buildStats(startOfToday, endOfNow),
        buildStats(startOfYesterday, startOfToday),
        buildStats(startOfLastWeek, endOfNow),
        buildStats(startOfLastMonth, endOfNow),
        buildStats(startOfLastYear, endOfNow),
      ]
    );

    res.json({
      today: {
        ...today,
        totalRegisteredUsers,
        totalLoggedUsers,
        registeredUserCountOnly: today.registeredUserCount,
        loggedInUserCountOnly: today.loggedInUserCount,
      },
      yesterday: {
        ...yesterday,
        totalRegisteredUsers,
        totalLoggedUsers,
        registeredUserCountOnly: yesterday.registeredUserCount,
        loggedInUserCountOnly: yesterday.loggedInUserCount,
      },
      lastWeek: {
        ...lastWeek,
        totalRegisteredUsers,
        totalLoggedUsers,
        registeredUserCountOnly: lastWeek.registeredUserCount,
        loggedInUserCountOnly: lastWeek.loggedInUserCount,
      },
      lastMonth: {
        ...lastMonth,
        totalRegisteredUsers,
        totalLoggedUsers,
        registeredUserCountOnly: lastMonth.registeredUserCount,
        loggedInUserCountOnly: lastMonth.loggedInUserCount,
      },
      lastYear: {
        ...lastYear,
        totalRegisteredUsers,
        totalLoggedUsers,
        registeredUserCountOnly: lastYear.registeredUserCount,
        loggedInUserCountOnly: lastYear.loggedInUserCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  approveFinanceUser,
  getFinanceUsers,
  getUserStats,
  getAllUsers,
  loginOrAutoRegister,
};
