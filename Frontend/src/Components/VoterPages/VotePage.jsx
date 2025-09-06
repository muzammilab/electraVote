import { motion } from "framer-motion";
import { ArrowLeft, User, Vote, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import VoterNavbar from "./VoterNavbar";

export default function VotePage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch election + candidates
  useEffect(() => {
    const fetchElection = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3001/election/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 attach token
            },
          }
        );
        console.log("Getting Candidates of Election for Voting :", res.data);
        setElection(res.data.election);
      } catch (err) {
        console.error("Error fetching election:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, [electionId]);

  const handleVote = (candidate) => {
    console.log("Selected Candidate is :", candidate);
    setSelectedCandidate(candidate);
  };

  // This is function is called when user confirms vote in modal
  const confirmVote = async () => {
    if (!selectedCandidate) return;

    // const confirmVote = () => {
    //   setVoteSubmitted(true);
    //   setSelectedCandidate(null);
    //   setTimeout(() => setVoteSubmitted(false), 3000); // Success message disappears after 3s
    // };

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:3001/election/${electionId}/vote`,
        { candidateId: selectedCandidate.candidate._id }, // send candidateId
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setVoteSubmitted(true);
      setSelectedCandidate(null);

      setTimeout(() => setVoteSubmitted(false), 3000);
    } catch (err) {
      console.error("Error voting:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit vote");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      <VoterNavbar />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <div className="w-full max-w-5xl space-y-12">
          {/* Election Name */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-lg"
          >
            {election?.title}
          </motion.h2>

          {/* Candidate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {election?.candidates.map((candidate, index) => (
              <motion.div
                key={candidate._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="relative group bg-gradient-to-br from-indigo-500/10 to-purple-700/10 border border-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center flex flex-col items-center space-y-4"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white/20 flex items-center justify-center">
                  <img
                    src={candidate.logo}
                    alt={candidate.party}
                    className="w-full h-full object-fill"
                  />
                </div>
                {/* <User className="h-12 w-12 text-indigo-400 drop-shadow-lg mx-auto" /> */}

                <h3 className="text-lg font-bold text-gray-100">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-400">{candidate.party}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote(candidate)}
                  className="relative w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                >
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <Vote className="h-5 w-5" /> Vote
                  </span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl max-w-md w-full p-6 text-center space-y-6"
          >
            <h3 className="text-xl font-bold text-pink-400">
              {election.title}
            </h3>
            <p className="text-gray-300">
              Are you sure you want to vote for{" "}
              <span className="font-semibold text-white">
                {selectedCandidate.name}
              </span>{" "}
              from{" "}
              <span className="font-semibold text-indigo-300">
                {selectedCandidate.party}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmVote}
                className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 rounded-xl text-white font-semibold shadow-md"
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCandidate(null)}
                className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 rounded-xl text-white font-semibold shadow-md"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Vote Submitted Animation */}
      {voteSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            className="bg-green-600/90 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="h-16 w-16 text-white" />
            <p className="text-white font-bold text-lg">
              Vote Submitted Successfully!
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
