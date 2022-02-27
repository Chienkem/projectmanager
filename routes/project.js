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
insertProject, InfoEmployeeProject,insertEmployee, insertProjectManager,
autoCompleteEmp,allProject,updatestatusProject,searchBar,projectinfo,allProjectManager,ability
} = require("../controller/Project")
router.get("/",verifyTokenAndAuthorizationManager, allProject);

router.get("/myproject", validateToken,allProjectManager)

router.post("/insert",verifyTokenAndAuthorizationManager, insertProject);

router.get("/info/:id", verifyTokenAndAuthorizationProjectManager,InfoEmployeeProject);

router.post("/employee/insert",verifyTokenAndAuthorizationManager,insertEmployee);

router.post("/manager/insert",verifyTokenAndAuthorizationManager,insertProjectManager);

router.post("/employee/autoComplete",verifyTokenAndAuthorizationManager,autoCompleteEmp);

router.put("/edit/status/:id",verifyTokenAndAuthorizationManager,updatestatusProject);

router.get("/searchQ",verifyTokenAndAuthorizationManager, searchBar)

router.get("/:id",verifyTokenAndAuthorizationProjectManager, projectinfo)

router.put("/ability", ability)
module.exports = router;