const express = require("express");
const router = express.Router();
const { Employee } = require("../models");
const bcrypt = require("bcrypt");
const {
  validateToken,
  verifyTokenAndAuthorizationAdmin,
  verifyTokenAndAuthorizationProjectManager,
  verifyTokenAndAuthorizationManager
} = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");
const {
  insertEmployee, login, auth, employeeinfo,
  searchBar,
  allEmployee, changePassword, updateAcitveEmployee,
  updateEmployee, profile,updateProfile
} = require("../controller/Employee")
router.post("/employee/insert", verifyTokenAndAuthorizationManager, insertEmployee);

router.post("/login", login);

router.put("/profile/edit/:id", validateToken, updateProfile);

router.get('/profile', validateToken, profile)

router.get("/auth", validateToken, auth);

router.get("/employee", validateToken, allEmployee)

router.put("/changepassword", validateToken, changePassword);

router.get("/employee/:id", verifyTokenAndAuthorizationProjectManager, employeeinfo)

router.put("/employee/edit/active/:id", verifyTokenAndAuthorizationManager, updateAcitveEmployee)

router.put("/employee/edit/:id", verifyTokenAndAuthorizationManager, updateEmployee)

router.get("/searchQ", verifyTokenAndAuthorizationProjectManager, searchBar)
module.exports = router;