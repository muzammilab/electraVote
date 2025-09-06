import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

export default function AdminResultsPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState();
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

        const adminRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Admin Data :", adminRes.data);
        setAdmin(adminRes.data.user);

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
      <AdminNavbar name={admin?.name} email={admin?.email}/>

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/elections/closed")}
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
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "./AdminNavbar";
import { Crown } from "lucide-react";

const Confetti = ({ trigger }) => {
  const confettiArray = Array.from({ length: 30 });
  return (
    <AnimatePresence>
      {trigger &&
        confettiArray.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: 0, opacity: 1 }}
            animate={{
              y: Math.random() * -200 - 50,
              x: (Math.random() - 0.5) * 300,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-yellow-400"
            style={{ top: 0, left: "50%" }}
          />
        ))}
    </AnimatePresence>
  );
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 8 });
  return (
    <>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, x: 0, opacity: 0.8 }}
          animate={{
            y: -Math.random() * 50 - 30,
            x: (Math.random() - 0.5) * 50,
            opacity: [0.8, 0.3, 0.8],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
          style={{
            top: Math.random() * 80 + "%",
            left: Math.random() * 80 + "%",
          }}
        />
      ))}
    </>
  );
};

// Helper function to chunk an array into smaller arrays of size `size`
const chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function AdminResultsPage() {
  const [elections] = useState([
    {
      id: 1,
      title: "Presidential Election 2024",
      status: "Completed",
      candidates: [
        { name: "Alice Johnson", votes: 120000 },
        { name: "Bob Smith", votes: 80000 },
        { name: "Carol Davis", votes: 45000 },
        { name: "Derek Green", votes: 60000 },
        { name: "Emma Stone", votes: 30000 },
        { name: "Bob Uso", votes: 25000 },
      ],
    },
    {
      id: 2,
      title: "University Senate Election",
      status: "Completed",
      candidates: [
        { name: "David Lee", votes: 5400 },
        { name: "Emma Watson", votes: 6200 },
      ],
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <AdminNavbar />

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-6 max-w-6xl mx-auto w-full"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Election Results
        </h2>
        <p className="text-gray-400 text-sm">
          Winners are highlighted with animations and badges. Vote bars indicate
          proportion.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="px-6 pb-12 max-w-6xl mx-auto w-full space-y-8"
      >
        {elections.map((election, idx) => {
          const maxVotes = Math.max(...election.candidates.map((c) => c.votes));
          const candidateRows = chunkArray(
            election.candidates.sort((a, b) => b.votes - a.votes),
            4
          );

          return (
            <motion.div
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-md relative overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-200 mb-6">
                {election.title}
              </h3>

              {/* Render each row of up to 4 candidates *
              {candidateRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-col md:flex-row md:gap-6 gap-4 mb-4 last:mb-0"
                >
                  {row.map((c, i) => {
                    const isWinner = i === 0 && rowIdx === 0 && election.status === "Completed"; // only top candidate overall
                    const votePercent = (c.votes / maxVotes) * 100;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ delay: 0.05 * i }}
                        className={`flex-1 p-4 rounded-xl border border-white/20 relative bg-white/5 ${
                          isWinner
                            ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/10 border-yellow-400 shadow-xl"
                            : ""
                        }`}
                      >
                        {isWinner && (
                          <>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }}
                              className="absolute -top-4 left-1/2 -translate-x-1/2"
                            >
                              <Crown className="h-8 w-8 text-yellow-400 animate-bounce" />
                            </motion.div>
                            <Confetti trigger={true} />
                            <FloatingParticles />
                          </>
                        )}

                        <div className="flex justify-between items-center mb-2">
                          <span
                            className={`font-semibold ${
                              isWinner ? "text-yellow-300" : ""
                            }`}
                          >
                            {c.name}
                          </span>
                          <motion.span
                            animate={isWinner ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                            className={`font-bold ${
                              isWinner ? "text-yellow-300" : "text-gray-200"
                            }`}
                          >
                            {c.votes.toLocaleString()}
                          </motion.span>
                        </div>

                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${votePercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-2 rounded-full ${
                            isWinner ? "bg-yellow-400" : "bg-cyan-500/50"
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          );
        })}
      </motion.section>
    </div>
  );
}
 */
