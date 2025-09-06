const Election = require("../model/election");
const Candidate = require("../model/candidate");
const User = require("../model/user");

// Create Election
// URL : POST /election/create
exports.createElection = async (req, res) => {
  try {
    const { title, year, startDate, startTime, endTime, candidates } = req.body;
    if (!title || !year || !startDate || !candidates || candidates.length < 2) {
      return res
        .status(400)
        .json({
          message: "Title, Year, Date and at least two Candidates are required",
        });
    }

    // Fetch candidate details properly
    const candidateDetails = await Promise.all(
      candidates.map(async (candId) => {
        const candidate = await Candidate.findById(candId);
        if (!candidate) throw new Error(`Candidate not found: ${candId}`);

        return {
          candidate: candidate._id,
          name: candidate.name,
          party: candidate.party,
          logo : candidate.logo,
        };
      })
    );

    // This was expecting full candidate objects from frontend but frontend is sending only IDs so we use above one.
    // const candidateDetails = candidates.map((cand) => ({
    //   candidate: cand.id,
    //   name: cand.name,
    //   party: cand.party,
    // }));

    const newElection = new Election({
      title,
      year,
      startDate,
      startTime,
      endTime,
      candidates: candidateDetails,
      isActive: false,
    });

    await newElection.save();
    res
      .status(201)
      .json({
        message: "Election created successfully",
        election: newElection,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all elections
// URL : GET /election/getAll
exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate("candidates.candidate", "name party")
      .populate("winner.candidate", "name party")
      .sort({ createdAt: -1 });
    res.status(200).json({ elections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get election by ID
// URL : GET /election/:electionId
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId)
      .populate("candidates.candidate", "name party")
      .populate("winner.candidate", "name party");

    if (!election)
      return res.status(404).json({ message: "Election not found" });

    res.status(200).json({ election });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all closed elections with winners
// URL : GET /election/closed
exports.getClosedElections = async (req, res) => {
  try {
    const closedElections = await Election.find({
      isActive: false,
      "winner.name": { $exists: true, $ne: "" },
    }).sort({ createdAt: -1 });

    console.log("Closed elections fetched:", closedElections.length);
    res.status(200).json({ closedElections });
  } catch (error) {
    console.error("Error fetching closed elections:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get active elections for landing page
// URL : GET /election/active
exports.getActiveElection = async (req, res) => {
  try {
    const activeElection = await Election.findOne({ isActive: true })
      .sort({ createdAt: -1 }); // optional: get the latest one if multiple

    if (!activeElection) {
      return res.status(404).json({ message: "No active election found" });
    }

    res.status(200).json({ activeElection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Election Stats
// URL: GET /election/stats
exports.getElectionStats = async (req, res) => {
  try {
    // 1. Total number of elections
    const totalElections = await Election.countDocuments();

    // 2. Total registered voters (eligible voters)
    const totalVoters = await User.countDocuments();

    // 3. Total votes cast across all elections
    const result = await Election.aggregate([
      { $unwind: "$candidates" },
      { $group: { _id: null, totalVotes: { $sum: { $size: "$candidates.votes" } } } }
    ]);

    const totalVotes = result.length > 0 ? result[0].totalVotes : 0;

    // 4. Turnout %
    const turnout = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(2) : "0.00";

    // Send response
    res.status(200).json({
      totalElections,
      totalVoters,
      totalVotes,
      turnout: `${turnout}%`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getElectionStats = async (req, res) => {
//   try {
//     // 1. Total number of elections
//     const totalElections = await Election.countDocuments();
// 
//     // 2. Total votes casted (from nested votes arrays)
//     const result = await Election.aggregate([
//       { $unwind: "$candidates" },
//       { $group: { _id: null, totalVotes: { $sum: { $size: "$candidates.votes" } } } }
//     ]);
// 
//     const totalVotes = result.length > 0 ? result[0].totalVotes : 0;
// 
//     res.status(200).json({
//       totalElections,
//       totalVotes
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Start Election
// URL : POST /election/:electionId/start
exports.startElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    if (election.isActive)
      return res.status(400).json({ message: "Election already active" });

    election.isActive = true;
    await election.save();

    res
      .status(200)
      .json({ message: "Election started successfully", election });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cast vote
// URL : POST /election/:electionId/vote
exports.voteForCandidate = async (req, res) => {
  try {
    const electionId = req.params.electionId;
    const { candidateId } = req.body;
    const userId = req.user.id;

    const election = await Election.findById(electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    if (!election.isActive)
      return res.status(400).json({ message: "Election is not active" });

    const candidateEntry = election.candidates.find(
      (cand) => cand.candidate.toString() === candidateId
    );
    if (!candidateEntry)
      return res
        .status(400)
        .json({ message: "Invalid candidate for this election" });

    const hasVoted = election.candidates.some((cand) =>
      cand.votes.some((vote) => vote.user.toString() === userId)
    );
    if (hasVoted)
      return res
        .status(400)
        .json({ message: "User has already voted in this election" });

    candidateEntry.voteCount += 1;
    candidateEntry.votes.push({ user: userId });

    await election.save();
    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close Election
// URL : POST /election/:electionId/close
exports.closeElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election)
      return res.status(404).json({ message: "Election not found" });

    if (!election.isActive)
      return res.status(400).json({ message: "Election already closed" });

    let winner = null;
    let maxVotes = -1;

    election.candidates.forEach((cand) => {
      if (cand.voteCount > maxVotes) {
        maxVotes = cand.voteCount;
        winner = cand;
      }
    });

    if (winner) {
      election.winner = {
        candidate: winner.candidate,
        name: winner.name,
        party: winner.party,
        logo : winner.logo,
      };
    }

    election.isActive = false;
    await election.save();

    res
      .status(200)
      .json({
        message: "Election closed successfully",
        winner: election.winner,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 
const Election = require("../model/election");
const Candidate = require("../model/candidate");
const User = require("../model/user");


exports.createElection = async (req, res) => {
  try {
    const { title, year, date, candidates } = req.body;
    if (!title || !year || !date || !candidates || candidates.length < 2) {
      return res
        .status(400)
        .json({ message: "Title, Year, Date and at least two Candidates are required" });
    }   
    // Prepare candidates array with candidate details
    const candidateDetails = candidates.map((cand) => ({
      candidate: cand.id,
      name: cand.name,
      party: cand.party,
    }));
    const newElection = new Election({
      title,
      year,
      date,
      candidates: candidateDetails,
      isActive: false, // Elections are created as inactive by default
    });
    await newElection.save();
    res.status(201).json({ message: "Election created successfully", election: newElection });
  } catch (error) {
    console.error("Error creating election:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate("candidates.candidate", "name party")
      .populate("winner", "name party")
      .sort({ createdAt: -1 });
    res.status(200).json({ elections });
  } catch (error) {
    console.error("Error fetching elections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getElectionById = async (req, res) => {
    try {   
        const electionId = req.params.id;
        const election = await Election.findById(electionId)
            .populate("candidates.candidate", "name party")
            .populate("winner", "name party");
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        res.status(200).json({ election });
    } catch (error) {
        console.error("Error fetching election:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.castVote = async (req, res) => {
  try {
    const electionId = req.params.id;
    const { candidateId } = req.body;
    const userId = req.user.id;
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    if (!election.isActive) {
        return res.status(400).json({ message: "Election is not active" });
    }
    const candidateEntry = election.candidates.find((cand) => cand.candidate.toString() === candidateId);
    if (!candidateEntry) {
      return res.status(400).json({ message: "Invalid candidate for this election" });
    }
    // Check if user has already voted in this election
    const hasVoted = election.candidates.some((cand) =>
      cand.votes.some((vote) => vote.user.toString() === userId)
    );
    if (hasVoted) {
      return res.status(400).json({ message: "User has already voted in this election" });
    }
    // Record the vote
    candidateEntry.voteCount += 1;
    candidateEntry.votes.push({ user: userId });
    await election.save();
    res.status(200).json({ message: "Vote cast successfully" });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.closeElection = async (req, res) => {
    try {
        const electionId = req.params.id;
        const election = await Election.findById(electionId);
        if (!election) {
            return res.status(404).json({ message: "Election not found" });
        }
        if (!election.isActive) {
            return res.status(400).json({ message: "Election is already closed" });
        }
        // Determine the winner
        let maxVotes = -1;
        let winnerCandidateId = null;
        election.candidates.forEach((cand) => {
            if (cand.voteCount > maxVotes) {
                maxVotes = cand.voteCount;
                winnerCandidateId = cand.candidate;
            }
        });
        election.winner = winnerCandidateId;
        election.isActive = false;
        await election.save();
        res.status(200).json({ message: "Election closed successfully", winner: election.winner });
    } catch (error) {
        console.error("Error closing election:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 
*/
