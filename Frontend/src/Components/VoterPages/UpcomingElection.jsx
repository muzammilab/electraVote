import { motion } from "framer-motion";
import { Calendar, Users, Vote, ArrowLeft, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import VoterNavbar from "./VoterNavbar";

export default function AdminUpcomingElection() {
  const navigate = useNavigate();
  const [activeElection, setActiveElection] = useState(null);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatTime(time24) {
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  useEffect(() => {
    const fetchElections = async () => {
      const token = localStorage.getItem("token");

      try {

        // Fetch user data to display name in navbar
        const userRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User Data :", userRes.data);
        setUserData(userRes.data.user);

        // Fetch all elections
        const res = await axios.get("http://localhost:3001/election/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        const elections = res.data.elections;

        // Pick active election (first one with isActive true)
        const active = elections.find((e) => e.isActive);

        // Pick upcoming (not active, no winner declared)
        const upcoming = elections.filter((e) => !e.isActive && !e.winner);

        setActiveElection(active || null);
        setUpcomingElections(upcoming || []);
      } catch (err) {
        console.error("Error fetching elections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      <VoterNavbar name={userData?.name} email={userData?.email}/>

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/elections")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
      />

      {/* Faint Election Icons in Background */}
      <div className="absolute inset-0 opacity-5 grid grid-cols-6 text-center text-6xl pointer-events-none select-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <Calendar key={i} className="mx-auto my-4" />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <div className="w-full max-w-5xl space-y-16">
          {/* Active Election Section */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.7)] tracking-wide"
          >
            🔥 Active Election
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ scale: 1.03 }}
            className="relative group bg-gradient-to-br from-pink-500/10 to-purple-700/10 border border-pink-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center space-y-5 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

            <Vote className="h-14 w-14 text-pink-400 drop-shadow-lg mx-auto" />
            <h3 className="text-2xl font-bold">{activeElection?.title}</h3>
            <p className="text-gray-300">{activeElection?.description}</p>

            {/* Date & Time */}
            {activeElection?.startDate &&
              activeElection?.startTime &&
              activeElection?.endTime && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-pink-400 font-semibold mt-2 text-sm md:text-base">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span>
                      {new Date(activeElection.startDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Divider - only visible on desktop */}
                  <span className="hidden sm:inline-block w-px h-5 bg-pink-400/40"></span>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⏰</span>
                    <span>
                      {formatTime(activeElection.startTime)} -{" "}
                      {formatTime(activeElection.endTime)}
                    </span>
                  </div>
                </div>
              )}

            {/* 
            {activeElection?.startDate && activeElection?.startTime && activeElection?.endTime && (
                <p className="text-pink-400 font-semibold">
                  📅 {new Date(activeElection.startDate).toLocaleDateString()} <br />
                  ⏰ {activeElection.startTime} - {activeElection.endTime}
                </p>
            )} 
            */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/voter/elections/upcoming/vote/${activeElection._id}`)}
              className="relative mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold shadow-lg text-white overflow-hidden group cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Vote className="h-5 w-5" /> Vote Now
              </span>
              <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(
                  `/voter/elections/upcoming/list/${activeElection?._id}`
                )
              }
              className="relative mt-4 ml-5 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-bold shadow-lg text-white overflow-hidden group cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Users className="h-5 w-5" /> View Candidates
              </span>
              <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
            </motion.button>
          </motion.div>

          {/* Upcoming Elections Section */}
          <motion.h2
            className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400"
            initial="hidden"
            animate="visible"
            variants={textVariant}
            custom={0}
          >
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-7 w-7 text-cyan-400" /> Upcoming Elections
            </span>
          </motion.h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {upcomingElections.map((election, index) => (
              <motion.div
                key={election._id}
                variants={textVariant}
                custom={index}
                whileHover={{ scale: 1.05 }}
                className="relative group bg-gradient-to-br from-indigo-500/10 to-purple-700/10 border border-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 text-center space-y-4"
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

                <Calendar className="h-12 w-12 text-indigo-400 drop-shadow-lg mx-auto" />
                <h3 className="text-lg font-bold text-gray-100">
                  {election.title}
                </h3>

                {/* Date & Time - Premium Style */}
                {election?.startDate &&
                  election?.startTime &&
                  election?.endTime && (
                    <div className="flex flex-nowrap items-center justify-center gap-4 text-sm md:text-base text-indigo-300 mt-1">
                      {/* Date */}
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-base">📅</span>
                        <span>
                          {new Date(election.startDate).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Divider */}
                      <span className="w-px h-5 bg-indigo-300/40"></span>

                      {/* Time */}
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="text-base">⏰</span>
                        <span>
                          {formatTime(election.startTime)} -{" "}
                          {formatTime(election.endTime)}
                        </span>
                      </div>
                    </div>
                  )}

                {/* Buttons */}
                <div className="space-y-3">
                  {/* View Candidates */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(`/voter/elections/upcoming/list/${election._id}`)
                    }
                    className="relative w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Users className="h-5 w-5" /> View Candidates
                    </span>
                    <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                  </motion.button>

                  
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

/* Less Improved UI
import { motion } from "framer-motion";
import { Calendar, Users, Vote, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpcomingElection() {
  const navigate = useNavigate();

  // Replace these with API data
  const activeElections = [
    { id: 7, title: "University Senate Elections", date: "Ongoing", active: true },
    { id: 8, title: "City Council Elections", date: "Ongoing", active: true },
  ];

  const upcomingElections = [
    { id: 1, title: "General Elections 2025", date: "March 15, 2025" },
    { id: 2, title: "Student Council Elections", date: "April 2, 2025" },
    { id: 3, title: "Local Body Elections", date: "May 10, 2025" },
    { id: 4, title: "Club Representative Elections", date: "June 1, 2025" },
    { id: 5, title: "Department Head Elections", date: "July 12, 2025" },
    { id: 6, title: "Alumni Association Elections", date: "Aug 22, 2025" },
  ];

  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      
      {/* Back Button 
      <div className="px-6 pb-8 flex relative z-10 mt-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center cursor-pointer gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Decorative Background Orbs 
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
      />

      {/* Election-themed faint background icons 
      <div className="absolute inset-0 opacity-5 grid grid-cols-6 text-center text-6xl pointer-events-none select-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <Calendar key={i} className="mx-auto my-4" />
        ))}
      </div>

      {/* Header 
      <header className="px-6 py-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 drop-shadow-lg"
        >
          Upcoming & Active Elections
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-gray-300 text-sm mt-3"
        >
          Discover elections, view candidates, and cast your vote.
        </motion.p>
      </header>

      {/* Active Elections 
      {activeElections.length > 0 && (
        <section className="relative z-10 px-6 pb-16">
          <motion.h2
            className="text-2xl font-bold text-cyan-400 mb-8 text-center"
            initial="hidden"
            animate="visible"
            variants={textVariant}
            custom={0}
          >
            🔥 Active Elections
          </motion.h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {activeElections.map((election, index) => (
              <motion.div
                key={election.id}
                variants={textVariant}
                custom={index}
                whileHover={{ scale: 1.05 }}
                className="relative group bg-gradient-to-br from-green-500/10 to-emerald-700/10 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-green-500/40 transition"
              >
                {/* Glowing Border 
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

                <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                  >
                    <Vote className="h-14 w-14 text-green-400 drop-shadow-lg" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    variants={textVariant}
                    custom={index + 0.1}
                  >
                    {election.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-300 text-sm"
                    variants={textVariant}
                    custom={index + 0.2}
                  >
                    {election.date}
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(`/voter/elections/${election.id}/vote`)
                    }
                    className="relative w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden"
                  >
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Vote className="h-5 w-5" /> Vote Now
                    </span>
                    <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Upcoming Elections 
      <section className="relative z-10 px-6 pb-16">
        <motion.h2
          className="text-2xl font-bold text-pink-400 mb-8 text-center"
          initial="hidden"
          animate="visible"
          variants={textVariant}
          custom={0}
        >
          📅 Upcoming Elections
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {upcomingElections.map((election, index) => (
            <motion.div
              key={election.id}
              variants={textVariant}
              custom={index}
              whileHover={{ scale: 1.05 }}
              className="relative group bg-gradient-to-br from-indigo-500/10 to-purple-700/10 border border-indigo-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-8 hover:shadow-indigo-500/40 transition"
            >
              {/* Glow 
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6 }}
                >
                  <Calendar className="h-14 w-14 text-indigo-400 drop-shadow-lg" />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold"
                  variants={textVariant}
                  custom={index + 0.1}
                >
                  {election.title}
                </motion.h3>
                <motion.p
                  className="text-gray-300 text-sm"
                  variants={textVariant}
                  custom={index + 0.2}
                >
                  {election.date}
                </motion.p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    navigate(`/voter/elections/${election.id}/candidates`)
                  }
                  className="relative w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden"
                >
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <Users className="h-5 w-5" /> View Candidates
                  </span>
                  <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

    </div>
  );
}
 */
