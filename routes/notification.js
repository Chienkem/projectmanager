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
insertnotification,allNotifications,isRead
} = require("../controller/notification")
router.post("/insert", insertnotification);
router.get('/all',validateToken,allNotifications);
router.put("/isRead",isRead);
module.exports = router;