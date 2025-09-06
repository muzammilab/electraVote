import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Trash2,
  Plus,
  X,
  User,
  Layers,
  Briefcase,
  Image,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

export default function ViewCandidatesList() {
  const navigate = useNavigate();
  const { electionId } = useParams(); // ✅ get electionId from URL
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    party: "",
    logo: "",
  });

  const [admin, setAdmin] = useState();
  const [election, setElection] = useState(null); // store election
  const [candidates, setCandidates] = useState([]); // store candidates of a particular election

  const colors = [
    "from-pink-500/20 to-pink-700/20 border-pink-400/30 hover:shadow-pink-500/40",
    "from-indigo-500/20 to-indigo-700/20 border-indigo-400/30 hover:shadow-indigo-500/40",
    "from-purple-500/20 to-purple-700/20 border-purple-400/30 hover:shadow-purple-500/40",
    "from-green-500/20 to-green-700/20 border-green-400/30 hover:shadow-green-500/40",
  ];

  // fetch admin for navbar
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

  // ✅ fetch election by id (with candidates)
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3001/election/${electionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Single Election Data:", res.data);

        setElection(res.data.election);
        setCandidates(res.data.election.candidates || []);
      } catch (err) {
        console.error("Error fetching election:", err);
      }
    };

    fetchElection();
  }, [electionId]);

  // ✅ delete candidate
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/candidate/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(candidates.filter((c) => c.candidate._id !== id));
    } catch (err) {
      console.error("Error deleting candidate:", err);
    }
  };

  // Check election status
  const showActions =
    election &&
    !election.isActive && // not active
    !election.winner; // no winner declared

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <AdminNavbar name={admin?.name} email={admin?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/elections/upcoming")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Title */}
      <motion.div className="flex-1 flex flex-col items-center px-6 py-6">
        <div className="w-full max-w-6xl">
          <h2 className="text-center mb-12">
            {/* "VIEW CANDIDATES" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="uppercase text-gray-100 tracking-widest text-xl md:text-2xl font-bold drop-shadow-md"
            >
              View Candidates
            </motion.div>

            {/* "OF" */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="uppercase text-pink-400 tracking-widest text-lg md:text-xl font-semibold mt-2"
            >
              OF
            </motion.div>

            {/* Election Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-2xl md:text-4xl font-extrabold mt-1 drop-shadow-lg"
            >
              {election?.title || "LOK SABHA ELECTION 2025"}
            </motion.div>
          </h2>

          {/* ✅ Show Add button only if allowed */}
          {showActions && (
            <div className="flex justify-center mb-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/admin/candidates/add/${electionId}`)}
                className="bg-cyan-500 hover:bg-cyan-600 p-4 rounded-full shadow-lg shadow-cyan-500/50 text-white flex items-center justify-center cursor-pointer z-25"
              >
                <Plus className="h-6 w-6" /> Add Candidate
              </motion.button>
            </div>
          )}

          {/* Candidate Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((member, index) => (
              <motion.div
                key={member.candidate._id}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${colors[index % colors.length]} 
                  backdrop-blur-lg border rounded-2xl shadow-xl p-6 
                  hover:shadow-xl transition flex flex-col items-center text-center space-y-4`}
              >
                <div className="w-25 h-25 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                  <img
                    src={member.logo}
                    alt={member.candidate.party}
                    className="w-full h-full object-fill"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-100">
                  {member.candidate.name}
                </h3>
                <p className="text-sm text-gray-300">{member.candidate.dept}</p>
                <p className="text-sm font-medium text-white">
                  {member.candidate.party}
                </p>

                {/* ✅ Show delete button only if allowed */}
                {showActions && (
                  <div className="flex gap-3 w-full">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(member.candidate._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500/30 to-red-700/30 border border-white/20 shadow-md hover:shadow-red-400/50 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* 
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, X, User, Layers, Briefcase, Image, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

export default function ViewCandidatesList() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    party: "",
    logo: "",
  });

  const colors = [
    "from-pink-500/20 to-pink-700/20 border-pink-400/30 hover:shadow-pink-500/40",
    "from-indigo-500/20 to-indigo-700/20 border-indigo-400/30 hover:shadow-indigo-500/40",
    "from-purple-500/20 to-purple-700/20 border-purple-400/30 hover:shadow-purple-500/40",
    "from-green-500/20 to-green-700/20 border-green-400/30 hover:shadow-green-500/40",
  ];

  // Fetch admin details to display name in navbar
  const [admin , setAdmin] = useState();

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
          
          setAdmin(adminRes.data.user);
        } catch (err) {
          console.error("Error fetching voter data:", err);
        }
      };
  
      fetchUserData();
    }, []);

  // Fetch candidate list from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/candidate/getAll"
        );
        console.log(response.data);
        setCandidates(response.data.candidates); // Ensure backend returns { candidates: [...] }
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  // Delete candidate
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/candidate/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(candidates.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting candidate:", err);
    }
  };

  // Open edit modal
  const handleEdit = (member) => {
    setEditingCandidate(member);
    setFormData({
      name: member.name,
      dept: member.dept,
      party: member.party,
      logo: member.logo,
    });
    setLogoPreview(member.logo); // Set initial preview
  };

  // handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file, // keep the actual file (for Multer)
      }));
      setLogoPreview(URL.createObjectURL(file)); // preview only
    }
  };

  // Save changes from modal
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", formData.name || "");
      payload.append("dept", formData.dept || "");
      payload.append("party", formData.party || "");
      payload.append("age", formData.age || "");
      // Only append logo if it's a File (new upload)
      if (formData.logo instanceof File) {
        payload.append("logo", formData.logo);
      }

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/candidate/update/${editingCandidate._id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCandidates(
        candidates.map((c) =>
          c._id === editingCandidate._id ? { ...c, ...formData } : c
        )
      );
      setEditingCandidate(null);
    } catch (err) {
      console.error("Error updating candidate:", err);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <AdminNavbar name={admin?.name} email={admin?.email} />

      {/* Back Button *
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/elections/upcoming")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Title *
      <motion.div className="flex-1 flex flex-col items-center px-6 py-6">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">
            View <span className="text-pink-400">Candidates</span>
          </h2>

          {/* Floating Add Candidate Button *
          <div className="flex justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/candidates/add")}
              className="bg-cyan-500 hover:bg-cyan-600 p-4 rounded-full shadow-lg shadow-cyan-500/50 text-white flex items-center justify-center cursor-pointer z-25"
            >
              <Plus className="h-6 w-6" /> Add Candidate
            </motion.button>
          </div>

          {/* Candidate Cards *
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((member, index) => (
              <motion.div
                key={member._id}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${colors[index % colors.length]} 
                  backdrop-blur-lg border rounded-2xl shadow-xl p-6 
                  hover:shadow-xl transition flex flex-col items-center text-center space-y-4`}
              >
                <div className="w-25 h-25 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                  <img
                    src={member.logo}
                    alt={member.party}
                    className="w-full h-full object-fill"
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-100">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-300">{member.dept}</p>
                <p className="text-sm font-medium text-white">{member.party}</p>

                <div className="flex gap-3 w-full">
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(member)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-pink-500/30 to-pink-700/30 border border-white/20 shadow-md hover:shadow-pink-400/50 transition"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </motion.button> *

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(member._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500/30 to-red-700/30 border border-white/20 shadow-md hover:shadow-red-400/50 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Edit Modal *
      {editingCandidate && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 rounded-3xl shadow-2xl backdrop-blur-xl w-full max-w-sm p-6 flex flex-col items-center gap-6 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <button
              onClick={() => setEditingCandidate(null)}
              className="absolute top-4 right-4 text-white hover:text-pink-400"
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-2xl font-bold text-gray-100">Edit Candidate</h3>

            {/* Name of Candidate *
            <div className="w-full flex flex-col gap-4">
              <div className="bg-gradient-to-br from-pink-500/20 to-pink-700/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3">
                <User className="w-5 h-5 text-pink-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
                  placeholder="Name"
                />
              </div>

              {/* Department of Candidate If College Elections *
              <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3">
                <Layers className="w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  value={formData.dept}
                  onChange={(e) =>
                    setFormData({ ...formData, dept: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
                  placeholder="Department"
                />
              </div>

              {/* Party Name of Candidate *
              <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-green-400" />
                <input
                  type="text"
                  value={formData.party}
                  onChange={(e) =>
                    setFormData({ ...formData, party: e.target.value })
                  }
                  className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none"
                  placeholder="Party Name"
                />
              </div>

              {/* Party Logo Upload *
              <div>
                {/* Upload Button 
                <label className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3 cursor-pointer">
                  <Image className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-300 text-sm truncate max-w-[150px]">
                    {formData.logo instanceof File
                      ? formData.logo.name
                      : "Upload Party Logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {/* 
                <Image className="w-5 h-5 text-yellow-400" />
                <input type="text" value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none" placeholder="Upload Party Logo" />
                *
              </div>
              {logoPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-25 w-25 rounded-full object-fill border border-white/30"
                  />
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="mt-4 w-full bg-pink-500/30 hover:bg-pink-500/50 text-white py-3 rounded-2xl font-bold shadow-md transition"
            >
              Save Changes
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
 */
