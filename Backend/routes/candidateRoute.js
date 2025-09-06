const express = require("express");
const candidateRouter = express.Router();
const candidateController = require("../controller/candidateC");
const { jwtAuthMiddleware } = require("../jwt");
const isAdmin = require("../controller/isAdmin");
const multer = require("multer");
const path = require("path");

// This route will be used for both admin & voter
candidateRouter.get(
    "/getAll", 
    candidateController.getAllCandidates
);

// Multer config For Party Logo Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

candidateRouter.post(
    "/create", 
    jwtAuthMiddleware,
    isAdmin,
    upload.single("logo"), // 'logo' should match the field name in the form
    candidateController.createCandidate
);

candidateRouter.put(
    "/update/:candidateId", 
    jwtAuthMiddleware,
    isAdmin,
    upload.single("logo"), // If you want to allow logo update as well  
    candidateController.updateCandidate
);

candidateRouter.delete(
    "/delete/:candidateId", 
    jwtAuthMiddleware,
    isAdmin,
    candidateController.deleteCandidate
);

// ** Voting Begins Here **
/* 
candidateRouter.post(
    "/vote/:candidateId", 
    jwtAuthMiddleware,
    candidateController.voteCandidate
);

candidateRouter.get(
    "/vote/count", 
    candidateController.voteCounting
); 
*/

module.exports = candidateRouter;