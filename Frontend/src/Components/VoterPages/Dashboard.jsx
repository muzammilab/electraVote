import { useEffect, useState } from "react";
import { LogOut, Vote, BarChart2, User, Users, Calendar, ClipboardList, Percent, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import VoterNavbar from "./VoterNavbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [ userData , setUserData ] = useState();
  const [ electionStats , setElectionStats ] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get(
          "http://localhost:3001/user/single",
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );
        console.log("Getting Voter Details");
        console.log(userRes.data);
        setUserData(userRes.data.user);
      } catch (err) {
        console.error("Error fetching voter data:", err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchElectionStats = async () => {
      try {
        const statsRes = await axios.get("http://localhost:3001/election/stats");
        console.log("Election Stats:", statsRes.data);
        setElectionStats(statsRes.data);
      } catch (err) {
        console.error("Error fetching election stats:", err);
      }
    }
    fetchElectionStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      {/* Top Navbar */}
      <VoterNavbar name={userData?.name} email={userData?.email} />

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 py-6 max-w-6xl mx-auto w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gray-100">
          Welcome back, <span className="text-pink-400">{userData?.name}</span> 
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Stay updated with elections, results, and candidates — all in one
          place.
        </p>
      </motion.section>

      {/* Stats Row */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-cyan-500/30 transition"
        >
          <Calendar className="h-10 w-10 text-cyan-400 mb-2" />
          <h3 className="text-lg font-semibold text-cyan-400">
            Total Elections
          </h3>
          <p className="text-3xl font-bold mt-1">{electionStats.totalElections}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-green-500/30 transition"
        >
          <ClipboardList className="h-10 w-10 text-green-400 mb-2" />
          <h3 className="text-lg font-semibold text-green-400">Votes Cast</h3>
          <p className="text-3xl font-bold mt-1">{electionStats.totalVotes}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-purple-500/30 transition"
        >
          <Percent className="h-10 w-10 text-purple-400 mb-2" />
          <h3 className="text-lg font-semibold text-purple-400">Turnout %</h3>
          <p className="text-3xl font-bold mt-1">{electionStats.turnout}</p>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="flex-1 flex items-center justify-center px-6 pb-12"
      >
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 - Cast Vote */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-700/10 border border-cyan-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-cyan-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Vote className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">
                Cast Your Vote
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Participate in the ongoing election securely and instantly.
              </p>
              <Link
                to="/voter/elections"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/40 transition"
              >
                Vote Now
              </Link>
            </div>
          </motion.div>

          {/* Card 2 - View Results */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500/10 to-green-700/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-green-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <BarChart2 className="h-12 w-12 text-green-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">View Results</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Track live updates and past election outcomes at a glance.
              </p>
              <Link
                to="/voter/elections/closed"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-green-500/40 transition"
              >
                View Results
              </Link>
            </div>
          </motion.div>

          {/* Card 3 - Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-purple-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <User className="h-12 w-12 text-purple-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Your Profile</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Manage your voter details, account, and preferences.
              </p>
              <Link
                to="/voter/profile"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-purple-500/40 transition"
              >
                View Profile
              </Link>
            </div>
          </motion.div>

          {/* Card 4 - Change Password */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-500/10 to-pink-700/10 border border-pink-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-pink-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Lock className="h-12 w-12 text-pink-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">
                Change Password
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Enhance your account security by updating your password
                regularly.
              </p>
              <Link
                to="/voter/profile/change-password"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-pink-500/40 transition"
              >
                Change Now
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}

/* Less Improved UI
import { useState } from "react";
import { LogOut, Vote, BarChart2, User, Users, Calendar, ClipboardList, Percent } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VoterNavbar from "./VoterNavbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState({ name: "John Doe", email: "john@example.com" });


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      {/* Top Navbar 
      <VoterNavbar />

      {/* Welcome Section 
      <section className="px-6 py-6 max-w-6xl mx-auto w-full text-center">
        <h2 className="text-2xl font-bold text-gray-100">
          Welcome back, <span className="text-pink-400">{user.name}</span> 👋
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Stay updated with elections, results, and candidates — all in one place.
        </p>
      </section>

      {/* Stats Row 
      <section className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-cyan-500/30 transition"
        >
          <Calendar className="h-10 w-10 text-cyan-400 mb-2" />
          <h3 className="text-lg font-semibold text-cyan-400">Total Elections</h3>
          <p className="text-3xl font-bold mt-1">12</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-green-500/30 transition"
        >
          <ClipboardList className="h-10 w-10 text-green-400 mb-2" />
          <h3 className="text-lg font-semibold text-green-400">Votes Cast</h3>
          <p className="text-3xl font-bold mt-1">8,524</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-purple-500/30 transition"
        >
          <Percent className="h-10 w-10 text-purple-400 mb-2" />
          <h3 className="text-lg font-semibold text-purple-400">Turnout %</h3>
          <p className="text-3xl font-bold mt-1">72%</p>
        </motion.div>
      </section>

      {/* Main Content 
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 - Cast Vote 
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-700/10 border border-cyan-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-cyan-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Vote className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Cast Your Vote</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Participate in the ongoing election securely and instantly.
              </p>
              <Link
                to="/voter/elections"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/40 transition"
              >
                Vote Now
              </Link>
            </div>
          </motion.div>

          {/* Card 2 - View Results 
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500/10 to-green-700/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-green-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <BarChart2 className="h-12 w-12 text-green-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">View Results</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Track live updates and past election outcomes at a glance.
              </p>
              <Link
                to="/voter/results"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-green-500/40 transition"
              >
                View Results
              </Link>
            </div>
          </motion.div>

          {/* Card 3 - Profile 
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-purple-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <User className="h-12 w-12 text-purple-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Your Profile</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Manage your voter details, account, and preferences.
              </p>
              <Link
                to="/voter/profile"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-purple-500/40 transition"
              >
                View Profile
              </Link>
            </div>
          </motion.div>

          {/* Card 4 - Candidate List 
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-500/10 to-pink-700/10 border border-pink-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-pink-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Users className="h-12 w-12 text-pink-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Candidate List</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Explore the candidates contesting in the current election.
              </p>
              <Link
                to="/voter/candidates"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-pink-500/40 transition"
              >
                View Candidates
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 
*/
