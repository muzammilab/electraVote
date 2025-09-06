const express = require("express");
const electionRouter = express.Router();
const electionController = require("../controller/electionC");
const { jwtAuthMiddleware } = require("../jwt");
const isAdmin = require("../controller/isAdmin");
const election = require("../model/election");

electionRouter.post(
    "/create", 
    jwtAuthMiddleware,
    isAdmin,
    electionController.createElection
);

electionRouter.get(
    "/getAll", 
    jwtAuthMiddleware,
    electionController.getAllElections
);

electionRouter.get(
    "/closed",
    jwtAuthMiddleware,
    electionController.getClosedElections
);

electionRouter.get(
    "/active",
    electionController.getActiveElection
);

electionRouter.get(
    "/stats",
    electionController.getElectionStats
);

electionRouter.get(
    "/:electionId", 
    jwtAuthMiddleware,
    electionController.getElectionById
);

electionRouter.post(
    "/:electionId/start", 
    jwtAuthMiddleware,
    isAdmin,
    electionController.startElection
);

electionRouter.post(
    "/:electionId/vote", 
    jwtAuthMiddleware,
    electionController.voteForCandidate
);


electionRouter.post(
    "/:electionId/close", 
    jwtAuthMiddleware,
    isAdmin,
    electionController.closeElection
);

module.exports = electionRouter;