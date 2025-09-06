import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarPlus, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function AddElection() {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [candidatesList, setCandidatesList] = useState([]);

  const [form, setForm] = useState({
    title: "",
    year: "",
    startDate: "",
    startTime: "",
    endTime: "",
    candidates: [], // store selected candidate IDs
  });

  // List of candidates from backend API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/candidate/getAll"
        );
        console.log(response.data);
        setCandidatesList(response.data.candidates); // Ensure backend returns { candidates: [...] }
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  // Fetch admin details to display name in navbar
  const [admin, setAdmin] = useState();

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
            Authorization: `Bearer ${token}`, // 👈 attach token
          },
        });

        setAdmin(adminRes.data.user);
      } catch (err) {
        console.error("Error fetching voter data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCandidateChange = (id, checked) => {
    const selected = form.candidates || [];
    if (checked) {
      setForm({ ...form, candidates: [...selected, id] });
    } else {
      setForm({ ...form, candidates: selected.filter((c) => c !== id) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
    const token = localStorage.getItem("token"); 

    const response = await axios.post(
      "http://localhost:3001/election/create", 
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    console.log("Election created:", response.data);

    setShowToast(true);
    toast.success("Election created successfully!");
    // Redirect after a short delay to allow toast to be seen
    setTimeout(() => {
      setShowToast(false);
      navigate("/admin/elections/upcoming");
    }, 2500);
  } catch (error) {
    console.error("Error creating election:", error);
    toast.error("Failed to create election. Please try again.");
  }
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <AdminNavbar name={admin?.name} email={admin?.email} />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center mb-6"
          >
            <div className="bg-white/10 p-3 rounded-full">
              <CalendarPlus className="h-8 w-8 text-cyan-300" />
            </div>
            <h1 className="mt-4 text-3xl font-bold">Add Election</h1>
            <p className="text-gray-300 text-sm mt-1">
              Fill out the details below to schedule a new election
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Election Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. Student Council Election 2025"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Year of Election
              </label>
              <input
                type="text"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="e.g. 2025"
              />
            </div>

            {/* Description */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-200">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="3"
                className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Enter a brief description of the election..."
              />
            </div> */}

            {/* Dates & Times */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-200">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Candidates Multi-Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Select Candidates
                <span className="text-xs text-gray-400 ml-2">
                  ({form.candidates.length} selected)
                </span>
              </label>

              <div className="relative">
                {/* Scrollable container with custom scrollbar */}
                <div className="max-h-48 overflow-y-auto border border-white/20 rounded-xl p-4 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm shadow-inner transition-all duration-200 hover:border-white/30 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent hover:[&::-webkit-scrollbar-thumb]:bg-cyan-400/40">
                  <div className="space-y-3">
                    {candidatesList.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className="group flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-white/10 cursor-pointer"
                      >
                        {/* Custom checkbox using Tailwind */}
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            value={candidate.id}
                            checked={form.candidates.includes(candidate.id)}
                            onChange={(e) =>
                              handleCandidateChange(
                                candidate.id,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                            id={`candidate-${candidate.id}`}
                          />
                          <label
                            htmlFor={`candidate-${candidate.id}`}
                            className="flex items-center justify-center w-5 h-5 border-2 border-gray-400 rounded cursor-pointer transition-all duration-200 group-hover:border-cyan-400 peer-checked:border-cyan-400 peer-checked:bg-cyan-400"
                          >
                            <svg
                              className={`w-3 h-3 text-gray-900 transition-all duration-200 ${
                                form.candidates.includes(candidate.id)
                                  ? "scale-100 opacity-100"
                                  : "scale-0 opacity-0"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </label>
                        </div>

                        {/* Candidate info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200 truncate">
                              {candidate.name}
                            </span>
                            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                              {/* Party logo */}
                              {candidate.partyLogo ? (
                                <img
                                  src={candidate.logo}
                                  alt={`${candidate.party} logo`}
                                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-cyan-400/50 transition-all duration-200"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}

                              {/* Party name with fallback icon */}
                              <span
                                className={`text-sm px-2 py-1 rounded-full bg-white/10 text-gray-300 group-hover:bg-cyan-400/20 group-hover:text-cyan-300 transition-all duration-200 flex items-center gap-1 ${
                                  candidate.logo ? "" : "flex"
                                }`}
                              >
                                <img src={candidate.logo} alt="" className="w-6 h-6 rounded-full overflow-hidden"/>
                                {candidate.party}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Selection indicator */}
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                            form.candidates.includes(candidate.id)
                              ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                              : "bg-gray-600 group-hover:bg-gray-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gradient fade effects */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-xl" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/5 to-transparent pointer-events-none rounded-b-xl" />
              </div>

              {/* Selection summary */}
              {form.candidates.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-cyan-400/10 border border-cyan-400/20 animate-fade-in">
                  <div className="flex items-center gap-2 text-sm text-cyan-300">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {form.candidates.length} candidate
                    {form.candidates.length !== 1 ? "s" : ""} selected
                  </div>
                </div>
              )}
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-gray-200">
                Select Candidates
              </label>
              <div className="mt-1 max-h-40 overflow-y-auto border border-white/20 rounded-lg p-2 bg-white/10">
                {candidatesList.map((candidate) => (
                  <div key={candidate.id} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      value={candidate.id}
                      checked={form.candidates.includes(candidate.id)}
                      onChange={(e) =>
                        handleCandidateChange(candidate.id, e.target.checked)
                      }
                      className="accent-cyan-400"
                    />
                    <span>{candidate.name}</span> - <span className="text-sm text-gray-400">{candidate.party}</span>

                  </div>
                ))}
              </div>
            </div> */}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition"
            >
              <CalendarPlus className="h-5 w-5" />
              Create Election
            </motion.button>
          </motion.form>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <Link
              to="/admin/manage-election"
              className="text-cyan-400 hover:underline text-sm"
            >
              ← Back to Manage Elections
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Election created successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
