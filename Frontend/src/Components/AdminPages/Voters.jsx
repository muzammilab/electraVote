import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function Voters() {
  const navigate = useNavigate();

  // const [voters, setVoters] = useState([
  //   { id: 1, name: "Aarav Sharma", email: "aarav.sharma@email.com", roll: "202501" },
  //   { id: 2, name: "Priya Patel", email: "priya.patel@email.com", roll: "202502" },
  //   { id: 3, name: "Rahul Mehta", email: "rahul.mehta@email.com", roll: "202503" },
  //   { id: 4, name: "Ananya Singh", email: "ananya.singh@email.com", roll: "202504" },
  // ]);

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, voterId: null });
  const [voters, setVoters] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3001/user/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Getting Voters : ", res.data);
        setVoters(res.data.users);
      } catch (err) {
        console.error("Error fetching voters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  // ✅ fetch admin for navbar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const adminRes = await axios.get("http://localhost:3001/user/single", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(adminRes.data.user);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };

    fetchUserData();
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

  const filtered = voters.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.roll.includes(search)
  );

  const handleEdit = (id) => alert(`Edit voter ${id}`);

  const openDeleteModal = (id) => setModal({ open: true, voterId: id });
  const closeModal = () => setModal({ open: false, voterId: null });

  const confirmDelete = () => {
    setVoters((prev) => prev.filter((v) => v.id !== modal.voterId));
    closeModal();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white relative">
      <AdminNavbar name={admin?.name} email={admin?.email} />

      <div className="flex-1 flex flex-col items-center p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="bg-white/10 p-3 rounded-full">
            <Users className="h-8 w-8 text-cyan-300" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">All Voters</h1>
          <p className="text-gray-300 text-sm mt-1">
            View and manage registered voters
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-3xl mb-8"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search voters by name, email, or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Floating Add Voter Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/add-voter")}
          className="bottom-8 left-8 mb-8 bg-cyan-500 hover:bg-cyan-600 p-4 rounded-full shadow-lg shadow-cyan-500/50 text-white flex items-center justify-center cursor-pointer z-25"
        >
          <Plus className="h-6 w-6" /> Add Voter
        </motion.button>

        {/* Voters Grid */}
        {filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full"
          >
            {filtered.map((voter, index) => (
              <motion.div
                key={voter._id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                whileHover={{
                  scale: 1.02,
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                className="group relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main card */}
                <div className="relative p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30 group-hover:shadow-2xl">
                  {/* Subtle shine effect */}
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header with avatar placeholder */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar circle */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-lg">
                          {voter.name?.charAt(0)?.toUpperCase() || "V"}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                          {voter.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-xs text-emerald-400 font-medium">
                            Active Voter
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-cyan-300">
                          📅
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Age
                        </p>
                        <p className="text-white font-semibold">{voter.age}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-300">
                          🎂
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Date of Birth
                        </p>
                        <p className="text-white font-semibold">
                          {voter.dob
                            ? new Date(voter.dob).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-300">
                          📧
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Email
                        </p>
                        <p className="text-white font-semibold text-sm truncate">
                          {voter.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-300">
                          📱
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">
                          Phone
                        </p>
                        <p className="text-white font-semibold">
                          {voter.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEdit(voter.id)}
                      className="relative p-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-200 group/btn overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-cyan-400/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
                      <Edit className="relative h-4 w-4 text-cyan-400 group-hover/btn:text-cyan-300" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openDeleteModal(voter.id)}
                      className="relative p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200 group/btn overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 to-red-400/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300" />
                      <Trash2 className="relative h-4 w-4 text-red-400 group-hover/btn:text-red-300" />
                    </motion.button>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 mt-10"
          >
            No voters found
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl max-w-sm w-full text-center"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-100">
                Confirm Deletion
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this voter?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
