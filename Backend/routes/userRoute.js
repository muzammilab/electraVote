const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/userController");
const { jwtAuthMiddleware } = require("../jwt");
const isAdmin = require("../controller/isAdmin");
const user = require("../model/user");

userRouter.post(
    "/signup",
    userController.postSignup
);

userRouter.post(
    "/login",
    userController.postLogin 
);

userRouter.get(
    "/getAll",
    jwtAuthMiddleware,
    isAdmin,
    userController.getAllUsers
);

userRouter.get(
    "/single",
    jwtAuthMiddleware,
    userController.getSingleUser
);

userRouter.get(
    "/profile", 
    jwtAuthMiddleware,
    userController.getProfile
);

userRouter.put(
    "/profile/change", 
    jwtAuthMiddleware,
    userController.changePassword
);

userRouter.put(
    "/profile/update", 
    jwtAuthMiddleware,
    userController.updateUserProfile
);


module.exports = userRouter;