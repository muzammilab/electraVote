const Candidate = require("../model/candidate");

// Create new candidate
// URL : POST /candidate/create
// Controller to create candidate with logo
exports.createCandidate = async (req, res) => {
  try {
    const { name, party, age } = req.body;

    // Construct full URL for uploaded logo
    let logo = null;
    // If file uploaded by multer
    if (req.file) {
      const baseUrl = process.env.BASE_URL || `http://localhost:3003`;
      logo = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const newCandidate = new Candidate({ name, party, age, logo });
    const response = await newCandidate.save();

    res.status(200).json({ 
      message: "Candidate created successfully", 
      candidate: response 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* 
exports.createCandidate = async (req, res) => {
  try {
    const { name, party, age } = req.body;
    // If file uploaded by multer
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const newCandidate = new Candidate({ name, party, age, logo });
    // const newCandidate = new Candidate(req.body);
    const response = await newCandidate.save();
    res.status(200).json({ message: "Candidate created successfully", candidate: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 
*/

// Get all candidates
// URL : GET /candidate/getAll
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update candidate details
// URL : PUT /candidate/update/:candidateId
exports.updateCandidate = async (req, res) => {
  const { candidateId } = req.params;

  // Build update object from text fields
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.dept) updateData.dept = req.body.dept;
    if (req.body.party) updateData.party = req.body.party;
    if (req.body.age) updateData.age = Number(req.body.age); // convert to number

  // If a new logo is uploaded, add it to updateData
  if (req.file) {
    updateData.logo = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  try {
    const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, updateData, { new: true });
    if (!updatedCandidate) return res.status(404).json({ error: "Candidate not found" });

    res.status(200).json({ message: "Candidate updated successfully", candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete candidate
// URL : DELETE /candidate/delete/:candidateId
exports.deleteCandidate = async (req, res) => {
  try {
    const deletedCandidate = await Candidate.findByIdAndDelete(req.params.candidateId);
    if (!deletedCandidate) return res.status(404).json({ error: "Candidate not found" });

    res.status(200).json({ message: "Candidate deleted successfully", deletedCandidate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* 
const Candidate = require("../model/candidate");
const User = require("../model/user");

// Get all candidates
// URL : GET /candidate/getAll
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// Create new candidate
// URL : POST /candidate/create
exports.createCandidate = async (req, res) => {
  try {
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    res.status(200).json({ message: "Candidate created successfully", candidate: response });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// Update candidate details
// URL : PUT /candidate/update/:candidateId
exports.updateCandidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const data = req.body;

    const updatedCandidate = await Candidate.findByIdAndUpdate(candidateId, data, { new: true });
    if (!updatedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate updated successfully", candidate: updatedCandidate });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// Delete candidate
// URL : DELETE /candidate/delete/:candidateId
exports.deleteCandidate = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);
    if (!deletedCandidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.status(200).json({ message: "Candidate deleted successfully", deletedCandidate });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// ** Voting Begins here **
// Vote for a candidate
// URL : POST /candidate/vote/:candidateId
exports.voteCandidate = async (req, res) => {
  // User can vote only once
  // Admin cannot vote

  const candidateId = req.params.candidateId;
  const userId = req.user.id; // userId is available in req.user after JWT authentication

  try {
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: "Admin cannot vote" });
    }

    if (user.isVoted) {
      return res.status(400).json({ error: "You have already voted" });
    }

    // Update candidate document to increment votes
    candidate.votes.push({ user : userId });
    candidate.voteCount++ ;
    await candidate.save();

    // Update user document to mark as voted
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote casted successfully for ", candidate });

  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

// Get vote count of all candidates
// URL : GET /candidate/vote/count
exports.voteCounting = async (req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return response with candidate names, parties, and their vote counts
    const voteRecord = candidates.map((candidate) => ({
      name: candidate.name,
      party: candidate.party,
      voteCount: candidate.voteCount,
    }));

    res.status(200).json({ voteRecord });

  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  } 
} 
*/