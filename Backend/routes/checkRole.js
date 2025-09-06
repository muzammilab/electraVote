const express = require("express");
const checkRoleRouter = express.Router();
const checkRoleController = require("../controller/checkRoleController");
const { jwtAuthMiddleware } = require("../jwt");

checkRoleRouter.get(
    "/role", 
    jwtAuthMiddleware, 
    checkRoleController.getRole
);

module.exports = checkRoleRouter;