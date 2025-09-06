import { motion } from "framer-motion";
import { Calendar, Users, Vote, ArrowLeft, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUpcomingElection() {
  const navigate = useNavigate();
  const [activeElection, setActiveElection] = useState(null);
  const [upcomingElections, setUpcomingElections] = useState([]);
  const [admin, setAdmin] = useState();
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

        const adminRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(adminRes.data.user);

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

  // Activate Election
  const handleActivateElection = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3001/election/${electionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Move the activated election to activeElection state
      const activatedElection = res.data.election;
      setActiveElection(activatedElection);

      // Remove it from upcoming elections
      setUpcomingElections((prev) => prev.filter((e) => e._id !== electionId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error activating election");
    }
  };

  // Deactivate Election
  const handleDeactivateElection = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3001/election/${electionId}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remove active election from top section
      setActiveElection(null);

      // Add it back to upcoming elections if winner is declared, or as inactive
      setUpcomingElections((prev) => [...prev, res.data.election || {}]);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deactivating election");
    }
  };

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
      <AdminNavbar name={admin?.name} email={admin?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/elections")}
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
              onClick={() => handleDeactivateElection(activeElection._id)}
              className="relative mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold shadow-lg text-white overflow-hidden group cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Power className="h-5 w-5" /> Deactivate
              </span>
              <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(
                  `/admin/elections/upcoming/list/${activeElection?._id}`
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
                      navigate(`/admin/elections/upcoming/list/${election._id}`)
                    }
                    className="relative w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Users className="h-5 w-5" /> View Candidates
                    </span>
                    <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                  </motion.button>

                  {/* Activate Election */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleActivateElection(election._id)}
                    className="relative w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                  >
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      ⚡ Activate
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
 

/* CLAUDE CODE 
import { motion } from "framer-motion";
import { Calendar, Users, Vote, ArrowLeft, Power } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUpcomingElection() {
  const navigate = useNavigate();
  const [activeElection, setActiveElection] = useState(null);
  const [upcomingElections, setUpcomingElections] = useState([]);
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
      try {
        const res = await axios.get("http://localhost:3001/election/getAll", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // Activate Election
  const handleActivateElection = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3001/election/${electionId}/start`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Find the election in upcoming elections
      const electionToActivate = upcomingElections.find((e) => e._id === electionId);
      
      if (electionToActivate) {
        // Set as active election (use response data if available, otherwise use local data)
        const activatedElection = res.data.election || { ...electionToActivate, isActive: true };
        setActiveElection(activatedElection);

        // Remove from upcoming elections
        setUpcomingElections((prev) => prev.filter((e) => e._id !== electionId));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error activating election");
    }
  };

  // Deactivate Election
  const handleDeactivateElection = async (electionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3001/election/${electionId}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Get the current active election before removing it
      const currentActiveElection = activeElection;

      // Clear active election
      setActiveElection(null);

      // Only add back to upcoming if it doesn't have a winner declared
      // and if the API doesn't return a winner in the response
      const deactivatedElection = res.data.election || { ...currentActiveElection, isActive: false };
      
      // Check if election should go back to upcoming (no winner declared)
      if (!deactivatedElection.winner) {
        setUpcomingElections((prev) => [...prev, deactivatedElection]);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error deactivating election");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
        {/* Spinner *
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-6"></div>

        {/* Loading Text *
        <p className="text-gray-300 text-lg font-medium animate-pulse">
          Loading elections...
        </p>

        {/* Optional Subtext *
        <p className="text-gray-400 mt-2 text-sm">
          Please wait while we fetch the latest election data
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      <AdminNavbar />

      {/* Back Button *
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/elections")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Floating Orbs *
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

      {/* Faint Election Icons in Background *
      <div className="absolute inset-0 opacity-5 grid grid-cols-6 text-center text-6xl pointer-events-none select-none">
        {Array.from({ length: 36 }).map((_, i) => (
          <Calendar key={i} className="mx-auto my-4" />
        ))}
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <div className="w-full max-w-5xl space-y-16">
          {/* Active Election Section *
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.7)] tracking-wide"
          >
            🔥 Active Election
          </motion.h2>

          {/* Active Election Content or No Active Election Message *
          {activeElection ? (
            <motion.div
              key={activeElection._id} // Add key for proper re-rendering
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              className="relative group bg-gradient-to-br from-pink-500/10 to-purple-700/10 border border-pink-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center space-y-5 overflow-hidden"
            >
              {/* Glow Effect *
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

              <Vote className="h-14 w-14 text-pink-400 drop-shadow-lg mx-auto" />
              <h3 className="text-2xl font-bold">{activeElection.title}</h3>
              <p className="text-gray-300">{activeElection.description}</p>

              {/* Date & Time *
              {activeElection?.startDate &&
                activeElection?.startTime &&
                activeElection?.endTime && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-pink-400 font-semibold mt-2 text-sm md:text-base">
                    {/* Date *
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📅</span>
                      <span>
                        {new Date(activeElection.startDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Divider - only visible on desktop *
                    <span className="hidden sm:inline-block w-px h-5 bg-pink-400/40"></span>

                    {/* Time *
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⏰</span>
                      <span>
                        {formatTime(activeElection.startTime)} -{" "}
                        {formatTime(activeElection.endTime)}
                      </span>
                    </div>
                  </div>
                )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeactivateElection(activeElection._id)}
                className="relative mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-xl font-bold shadow-lg text-white overflow-hidden group cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <Power className="h-5 w-5" /> Deactivate
                </span>
                <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate(
                    `/admin/elections/upcoming/list/${activeElection._id}`
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
          ) : (
            // No Active Election Message
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative group bg-gradient-to-br from-gray-500/10 to-slate-700/10 border border-gray-500/20 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center space-y-5 overflow-hidden"
            >
              {/* Glow Effect *
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400 to-slate-400 opacity-0 group-hover:opacity-10 blur-xl transition duration-500"></div>

              <Vote className="h-14 w-14 text-gray-400 drop-shadow-lg mx-auto opacity-50" />
              <h3 className="text-2xl font-bold text-gray-400">No Active Election</h3>
              <p className="text-gray-500">There are currently no active elections running.</p>
              <p className="text-gray-500 text-sm">Activate an election from the upcoming elections below.</p>
            </motion.div>
          )}

          {/* Upcoming Elections Section *
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

          {/* Upcoming Elections Grid or No Elections Message *
          {upcomingElections.length > 0 ? (
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
                  {/* Glow *
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-xl transition duration-500"></div>

                  <Calendar className="h-12 w-12 text-indigo-400 drop-shadow-lg mx-auto" />
                  <h3 className="text-lg font-bold text-gray-100">
                    {election.title}
                  </h3>

                  {/* Date & Time - Premium Style *
                  {election?.startDate &&
                    election?.startTime &&
                    election?.endTime && (
                      <div className="flex flex-nowrap items-center justify-center gap-4 text-sm md:text-base text-indigo-300 mt-1">
                        {/* Date *
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-base">📅</span>
                          <span>
                            {new Date(election.startDate).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Divider *
                        <span className="w-px h-5 bg-indigo-300/40"></span>

                        {/* Time *
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <span className="text-base">⏰</span>
                          <span>
                            {formatTime(election.startTime)} -{" "}
                            {formatTime(election.endTime)}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Buttons *
                  <div className="space-y-3">
                    {/* View Candidates *
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        navigate(`/admin/elections/upcoming/list/${election._id}`)
                      }
                      className="relative w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <Users className="h-5 w-5" /> View Candidates
                      </span>
                      <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                    </motion.button>

                    {/* Activate Election *
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleActivateElection(election._id)}
                      className="relative w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md overflow-hidden group cursor-pointer"
                    >
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        ⚡ Activate
                      </span>
                      <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl"></span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // No Upcoming Elections Message
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center py-12"
            >
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Upcoming Elections</h3>
              <p className="text-gray-500">All elections are either active or completed.</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
 */

