import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, History, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function AdminUpcomingPastElection() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState();

  // Fetch admin details to display name in navbar
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const fetchUserData = async () => {
      try {
        const adminRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setAdmin(adminRes.data.user);
      } catch (err) {
        console.error("Error fetching voter data:", err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      <AdminNavbar name={admin?.name} email={admin?.email}/>

      {/* Animated Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 flex flex-col"
      >
        {/* Back Button */}
        <div className="px-6 pb-8 flex relative z-10 mt-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>
        </div>

        {/* Decorative Glow Background */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Header */}
        <header className="px-6 py-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 drop-shadow-lg"
          >
            Select Election Type
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-gray-300 text-sm mt-3"
          >
            Choose between upcoming and past elections to continue.
          </motion.p>
        </header>

        {/* Cards */}
        <main className="flex-1 flex items-center justify-center px-6 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
            className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-10"
          >
            {/* Upcoming Elections */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-cyan-500/10 to-cyan-700/10 border border-cyan-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-10 hover:shadow-cyan-500/40 transition"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <Calendar className="h-14 w-14 text-cyan-400 drop-shadow-lg" />
                <h2 className="text-2xl font-bold tracking-wide">Upcoming Elections</h2>
                <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                  Explore and participate in upcoming elections before the deadlines.
                </p>
                <Link
                  to="/admin/elections/upcoming"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-cyan-500/40 transition"
                >
                  View Upcoming
                </Link>
              </div>
            </motion.div>

            {/* Past Elections */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-700/10 border border-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-10 hover:shadow-purple-500/40 transition"
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <History className="h-14 w-14 text-purple-400 drop-shadow-lg" />
                <h2 className="text-2xl font-bold tracking-wide">Past Elections</h2>
                <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                  Browse past elections and see results & candidate details.
                </p>
                <Link
                  to="/admin/elections/closed"
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-purple-500/40 transition"
                >
                  View Past
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
