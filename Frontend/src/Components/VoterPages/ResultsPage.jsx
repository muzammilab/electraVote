import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import VoterNavbar from "./VoterNavbar";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();
  const [error, setError] = useState(null);

  const confettiPieces = Array.from({ length: 20 });

  useEffect(() => {
    const fetchElection = async () => {

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user data to display name in navbar
        const userRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User Data :", userRes.data);
        setUserData(userRes.data.user);

        // Fetch election details
        const res = await axios.get(
          `http://localhost:3001/election/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Election Data :", res.data);
        setElection(res.data.election);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch election results");
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [electionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>

        {/* Loading Text */}
        <p className="text-gray-300 text-lg font-medium animate-pulse">
          Loading elections...
        </p>

        {/* Optional Subtext */}
        <p className="text-gray-400 mt-2 text-sm">
          Please wait while we fetch the latest election data
        </p>
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900">
        <p>{error || "Election not found"}</p>
      </div>
    );
  }

  const candidates = election.candidates || [];
  const totalVotes = candidates.reduce((acc, c) => acc + (c.voteCount || 0), 0);
  const winner =
    candidates.length > 0
      ? candidates.reduce((prev, current) =>
          (prev.voteCount || 0) > (current.voteCount || 0) ? prev : current
        )
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <VoterNavbar name={userData?.name} email={userData?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/elections/closed")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-lg mb-10"
        >
          {election?.title} - Results
        </motion.h2>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {candidates
            .slice() // copy to avoid mutating original
            .sort((a, b) => b.voteCount - a.voteCount) // sort descending
            .map((candidate, index) => {
              const votePercent =
                totalVotes > 0
                  ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
                  : 0;
              const isWinner = winner && candidate._id === winner._id;

              return (
                <motion.div
                  key={candidate._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative group bg-gradient-to-br from-indigo-500/10 to-purple-700/10 border border-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-4 ${
                    isWinner
                      ? "border-yellow-400 shadow-yellow-400/50 hover:shadow-yellow-500/60"
                      : ""
                  }`}
                >
                  {/* Winner Badge */}
                  {isWinner && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1.2 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="absolute -top-3 right-3 flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-full shadow-lg"
                    >
                      <CheckCircle className="h-5 w-5" /> Winner
                    </motion.div>
                  )}

                  {/* Confetti */}
                  {isWinner &&
                    confettiPieces.map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          y: [-20, 200],
                          x: [
                            -50 + Math.random() * 100,
                            50 - Math.random() * 100,
                          ],
                          rotate: [0, 360],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 1.5 + Math.random(),
                          delay: Math.random() * 0.5,
                          ease: "easeOut",
                        }}
                        className="absolute w-2 h-2 rounded-full bg-yellow-400"
                      />
                    ))}

                  {/* Party Logo */}
                  <div className="w-25 h-25 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                    <img
                      src={candidate.logo}
                      alt={candidate.party}
                      className="max-w-full h-full object-contain"
                    />
                  </div>

                  <h3
                    className={`text-lg font-bold ${
                      isWinner ? "text-yellow-400" : "text-gray-100"
                    }`}
                  >
                    {candidate.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isWinner ? "text-yellow-300" : "text-gray-300"
                    }`}
                  >
                    {candidate.party}
                  </p>

                  <div className="w-full bg-white/20 rounded-xl overflow-hidden h-4 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${votePercent}%` }}
                      transition={{ duration: 1 }}
                      className={`h-4 ${
                        isWinner ? "bg-yellow-400" : "bg-pink-500"
                      }`}
                    ></motion.div>
                  </div>
                  <p
                    className={`text-sm ${
                      isWinner ? "text-yellow-200" : "text-gray-200"
                    }`}
                  >
                    {candidate.voteCount} votes ({votePercent}%)
                  </p>

                  {/* Glow effect for winner */}
                  {isWinner && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5, scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl bg-yellow-400 blur-2xl mix-blend-screen"
                    ></motion.div>
                  )}
                </motion.div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

/* 
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoterNavbar from "./VoterNavbar";

export default function ResultsPage() {
  const navigate = useNavigate();

  const electionName = "Student Council Election 2025";

  const [candidates] = useState([
    { id: 1, name: "Alice Johnson", party: "Unity Party", votes: 320, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png" },
    { id: 2, name: "Bob Smith", party: "Progress Party", votes: 275, logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_example.png" },
    { id: 3, name: "Carol Lee", party: "Vision Party", votes: 410, logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" },
  ]);

  const totalVotes = candidates.reduce((acc, c) => acc + c.votes, 0);
  const winner = candidates.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  const confettiPieces = Array.from({ length: 20 });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <VoterNavbar />

      {/* Back Button *
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/elections/results")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-lg mb-10"
        >
          {electionName} - Live Results
        </motion.h2>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {candidates.map((candidate, index) => {
            const votePercent = ((candidate.votes / totalVotes) * 100).toFixed(1);
            const isWinner = candidate.id === winner.id;

            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className={`relative group bg-gradient-to-br from-indigo-500/10 to-purple-700/10 border border-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col items-center space-y-4 ${
                  isWinner ? "border-yellow-400 shadow-yellow-400/50 hover:shadow-yellow-500/60" : ""
                }`}
              >
                {/* Winner Badge *
                {isWinner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="absolute -top-3 right-3 flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/20 backdrop-blur-md px-3 py-1 rounded-full shadow-lg"
                  >
                    <CheckCircle className="h-5 w-5" /> Winner
                  </motion.div>
                )}

                {/* Confetti *
                {isWinner &&
                  confettiPieces.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                      animate={{
                        y: [-20, 200],
                        x: [-50 + Math.random() * 100, 50 - Math.random() * 100],
                        rotate: [0, 360],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        delay: Math.random() * 0.5,
                        ease: "easeOut",
                      }}
                      className={`absolute w-2 h-2 rounded-full bg-yellow-400`}
                    />
                  ))}

                {/* Party Logo *
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                  <img src={candidate.logo} alt={candidate.party} className="max-w-full h-full object-contain" />
                </div>

                <h3 className={`text-lg font-bold ${isWinner ? "text-yellow-400" : "text-gray-100"}`}>
                  {candidate.name}
                </h3>
                <p className={`text-sm ${isWinner ? "text-yellow-300" : "text-gray-300"}`}>
                  {candidate.party}
                </p>

                <div className="w-full bg-white/20 rounded-xl overflow-hidden h-4 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${votePercent}%` }}
                    transition={{ duration: 1 }}
                    className={`h-4 ${isWinner ? "bg-yellow-400" : "bg-pink-500"}`}
                  ></motion.div>
                </div>
                <p className={`text-sm ${isWinner ? "text-yellow-200" : "text-gray-200"}`}>
                  {candidate.votes} votes ({votePercent}%)
                </p>

                {/* Glow effect for winner 
                {isWinner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5, scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl bg-yellow-400 blur-2xl mix-blend-screen"
                  ></motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
*/