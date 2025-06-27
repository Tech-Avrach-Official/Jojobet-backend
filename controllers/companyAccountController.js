const CompanyAccount = require("../models/CompanyAccount");

// Create a new Company Account
const createCompanyAccount = async (req, res) => {
  try {
    // If files have been uploaded, override the request body with their URLs.
    console.log("req files:",req.files);
    console.log("req body",req.body);
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        req.body.image = req.files.image[0].path;
      }
      if (req.files.QRcode && req.files.QRcode.length > 0) {
        req.body.QRcode = req.files.QRcode[0].path;
      }
    }

    const account = new CompanyAccount(req.body);
    await account.save();
    res.status(201).json({
      message: "Company account created successfully",
      account,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create company account",
      error: error.message,
    });
  }
};

// Update an existing Company Account
const updateCompanyAccount = async (req, res) => {
  try {
    console.log("req files:",req.files);
    console.log("req body",req.body);
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        req.body.image = req.files.image[0].path;
      }
      if (req.files.QRcode && req.files.QRcode.length > 0) {
        req.body.QRcode = req.files.QRcode[0].path;
      }
    }
    
    const updatedAccount = await CompanyAccount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAccount) {
      return res.status(404).json({ message: "Company account not found" });
    }
    res.json({ message: "Company account updated successfully", account: updatedAccount });
  } catch (error) {
    res.status(500).json({ message: "Failed to update company account", error: error.message });
  }
};

// Delete a Company Account
const deleteCompanyAccount = async (req, res) => {
  try {
    const account = await CompanyAccount.findByIdAndDelete(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Company account not found" });
    }
    res.json({ message: "Company account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete company account", error: error.message });
  }
};

// Fetch all Company Accounts
const getAllCompanyAccounts = async (req, res) => {
    try {
      const accounts = await CompanyAccount.find().sort({ updatedAt: -1 });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company accounts", error: error.message });
    }
  };

module.exports = { createCompanyAccount, updateCompanyAccount, deleteCompanyAccount , getAllCompanyAccounts };
