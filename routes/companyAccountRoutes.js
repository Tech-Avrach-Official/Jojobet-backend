const express = require("express");
const router = express.Router();
const CompanyAccount = require("../models/CompanyAccount");
const {
  isAuthenticated,
  isFinanceAdmin,
  isAdminFinanceOrFinanceAdmin,
  isAdminOrFinanceAdmin,
} = require("../middleware/authMiddleware");
const {
  createCompanyAccount,
  updateCompanyAccount,
  deleteCompanyAccount,
  getAllCompanyAccounts,
} = require("../controllers/companyAccountController");
const upload = require("../middleware/upload");

router.post(
  "/createaccount",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "QRcode", maxCount: 1 },
  ]),
  
  createCompanyAccount
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "QRcode", maxCount: 1 },
  ]),
  isAuthenticated,
  isAdminFinanceOrFinanceAdmin,
  updateCompanyAccount
);

router.delete(
  "/:id",
  isAuthenticated,
  isAdminFinanceOrFinanceAdmin,
  deleteCompanyAccount
);

router.get("/allcompany", getAllCompanyAccounts);

module.exports = router;
