import { useEffect, useState } from "react";
import { Users, Calendar, ClipboardList, Percent, BarChart2, User, Settings, Lock, PlusCircle, Award, FileText, Users2, Users2Icon, UserSquare2, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function AdminDashboard() {
  const [admin , setAdmin] = useState();
  const [ electionStats , setElectionStats ] = useState([]);

  useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
  
      const fetchUserData = async () => {
        try {
          const adminRes = await axios.get(
            "http://localhost:3001/user/single",
            {
              headers: {
                Authorization: `Bearer ${token}`, // 👈 attach token
              },
            }
          );
          console.log("Getting Admin Details");
          console.log(adminRes.data);
          setAdmin(adminRes.data.user);
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
      <AdminNavbar name={admin?.name} email={admin?.email} /> 

      {/* Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 py-6 max-w-6xl mx-auto w-full text-center"
      >
        <h2 className="text-2xl font-bold text-gray-100">
          Welcome back, <span className="text-pink-400">{admin?.name}</span> 
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Monitor elections, voter activity, and system statistics — all in one place.
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
          <h3 className="text-lg font-semibold text-cyan-400">Total Elections</h3>
          <p className="text-3xl font-bold mt-1">{electionStats.totalElections}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-md hover:shadow-green-500/30 transition"
        >
          <ClipboardList className="h-10 w-10 text-green-400 mb-2" />
          <h3 className="text-lg font-semibold text-green-400">Active Voter</h3>
          <p className="text-3xl font-bold mt-1">{electionStats.totalVoters}</p>
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

      {/* Main Action Cards */}
      <motion.main
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="flex-1 flex items-center justify-center px-6 pb-12"
      >
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 - Manage Elections */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-700/10 border border-cyan-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-cyan-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <ClipboardList className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Manage Elections</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Create, edit, or delete elections securely and efficiently.
              </p>
              <Link
                to="/admin/elections"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/40 transition"
              >
                Go to Elections
              </Link>
            </div>
          </motion.div>

          {/* Card 2 - Manage Voters */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-green-500/10 to-green-700/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-green-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Users className="h-12 w-12 text-green-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Manage Voters</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Add, verify, or remove voters and manage their accounts.
              </p>
              <Link
                to="/admin/voters"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-green-500/40 transition"
              >
                Go to Voters
              </Link>
            </div>
          </motion.div>

          {/* Card 3 - Add Election */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-purple-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <PlusCircle className="h-12 w-12 text-purple-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Add Election</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Add a new election to the system with all necessary details.
              </p>
              <Link
                to="/admin/add-election"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-purple-500/40 transition"
              >
                Add Election
              </Link>
            </div>
          </motion.div>

          {/* Card 4 - View Results */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-pink-500/10 to-pink-700/10 border border-pink-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-pink-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <BarChart2 className="h-12 w-12 text-pink-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Election Results</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                View detailed results and analytics of completed elections.
              </p>
              <Link
                to="/admin/elections/closed"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-pink-500/40 transition"
              >
                View Results
              </Link>
            </div>
          </motion.div>

          {/* Card 5 - Manage Candidates */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-purple-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <Users2 className="h-12 w-12 text-purple-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Manage Candidates</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                View, edit, or delete candidates securely and efficiently.
              </p>
              <Link
                to="/admin/candidates/list"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-purple-500/40 transition"
              >
                View Candidates
              </Link>
            </div>
          </motion.div>

          {/* Card 6 - Add Candidate */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-700/10 border border-cyan-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-cyan-500/40 transition"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <ClipboardList className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
              <h2 className="text-xl font-bold tracking-wide">Add Candidate</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                
                Add a new candidate to the system with all necessary details.
              </p>
              <Link
                to="/admin/candidates/add"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/40 transition"
              >
                Add Candidate
              </Link>
            </div>
          </motion.div>

        </div>
      </motion.main>
    </div>
  );
}
