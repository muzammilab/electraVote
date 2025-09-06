import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

export default function ManageElections() {
  const [elections, setElections] = useState([
    /* {
      id: 1,
      title: "Presidential Election 2024",
      startDateTime: "2024-11-01T09:00",
      endDateTime: "2024-11-01T17:00",
      status: "Live",
      votes: 123456,
      candidates: [
        { id: 1, name: "Alice Johnson" },
        { id: 2, name: "Bob Smith" },
      ],
    },
    {
      id: 2,
      title: "University Senate Election",
      startDateTime: "2024-09-15T10:00",
      endDateTime: "2024-09-15T15:00",
      status: "Completed",
      votes: 2548,
      candidates: [
        { id: 3, name: "Charlie Brown" },
        { id: 4, name: "Diana Prince" },
      ],
    },
    {
      id: 3,
      title: "Local Council Election",
      startDateTime: "2024-10-01T08:00",
      endDateTime: "2024-10-01T18:00",
      status: "Upcoming",
      votes: 0,
      candidates: [{ id: 5, name: "Eve Adams" }],
    }, */
  ]);

  useEffect(() => {
  const fetchElections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/election/getAll"
        );
        console.log(response.data);
        setElections(response.data);
      } catch (error) {
      console.error("Error fetching elections:", error);
    }

    fetchElections();
  }; 
}, []);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    electionId: null,
  });
  const [candidateModal, setCandidateModal] = useState({
    open: false,
    candidates: [],
  });

  const handleEdit = (id) => alert(`Edit election ${id}`);
  const handleDelete = (id) => alert(`Delete election ${id}`);
  const openModal = (type, electionId) =>
    setModal({ open: true, type, electionId });
  const closeModal = () =>
    setModal({ open: false, type: "", electionId: null });

  const openCandidateModal = (candidates) =>
    setCandidateModal({ open: true, candidates });
  const closeCandidateModal = () =>
    setCandidateModal({ open: false, candidates: [] });

  const confirmAction = () => {
    const { electionId, type } = modal;
    setElections((prev) =>
      prev.map((e) => {
        if (e.id === electionId) {
          if (type === "activate") return { ...e, status: "Live" };
          if (type === "inactive") return { ...e, status: "Completed" };
        }
        return e;
      })
    );
    closeModal();
  };

  const activeElections = elections.filter(
    (e) => e.status === "Live" || e.status === "Upcoming"
  );
  const completedElections = elections.filter((e) => e.status === "Completed");

  const renderTable = (data) => (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {data.map((election, idx) => {
        const start = new Date(election.startDateTime);
        const end = new Date(election.endDateTime);

        return (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-colors"
          >
            {/* Mobile Card */}
            <div className="sm:hidden flex flex-col gap-2">
              <h4 className="font-semibold text-gray-200">{election.title}</h4>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>{start.toLocaleDateString()}</span>
                <span>
                  {start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>
                  End:{" "}
                  {end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`font-semibold px-2 py-1 rounded-full text-xs ${
                    election.status === "Live"
                      ? "bg-cyan-400/20 text-cyan-400"
                      : election.status === "Upcoming"
                      ? "bg-purple-400/20 text-purple-400"
                      : "bg-green-400/20 text-green-400"
                  }`}
                >
                  {election.status}
                </span>
              </div>
              <div className="flex justify-between mt-2 items-center">
                <button
                  onClick={() => openCandidateModal(election.candidates)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 px-3 py-1 rounded-xl text-cyan-400 font-semibold text-sm transition"
                >
                  View Candidates
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(election.id)}
                    className="bg-cyan-500/20 p-2 rounded-xl"
                  >
                    <Edit className="h-4 w-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(election.id)}
                    className="bg-red-500/20 p-2 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {election.status === "Upcoming" && (
                  <button
                    onClick={() => openModal("activate", election.id)}
                    className="bg-green-500/20 hover:bg-green-500/40 px-3 py-1 rounded-xl text-green-400 font-semibold text-sm transition"
                  >
                    Activate
                  </button>
                )}
                {election.status === "Live" && (
                  <button
                    onClick={() => openModal("inactive", election.id)}
                    className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-xl text-red-400 font-semibold text-sm transition"
                  >
                    Inactive
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Table Row */}
            <div className="hidden sm:grid sm:grid-cols-8 sm:items-center gap-2">
              <div>
                <span className="text-gray-400 text-xs block">Title</span>
                <span className="font-semibold text-gray-200">
                  {election.title}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Start Date</span>
                <span>{start.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Start Time</span>
                <span>
                  {start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">End Time</span>
                <span>
                  {end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Status</span>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                    election.status === "Live"
                      ? "bg-cyan-400/20 text-cyan-400"
                      : election.status === "Upcoming"
                      ? "bg-purple-400/20 text-purple-400"
                      : "bg-green-400/20 text-green-400"
                  }`}
                >
                  {election.status}
                </motion.span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Votes</span>
                <span>{election.votes.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Candidates</span>
                <button
                  onClick={() => openCandidateModal(election.candidates)}
                  className="mt-1 bg-cyan-500/20 hover:bg-cyan-500/40 px-3 py-1 rounded-xl text-cyan-400 font-semibold text-sm transition cursor-pointer"
                >
                  View
                </button>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handleEdit(election.id)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 p-2 rounded-xl transition cursor-pointer"
                >
                  <Edit className="h-4 w-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(election.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
                {election.status === "Upcoming" && (
                  <button
                    onClick={() => openModal("activate", election.id)}
                    className="bg-green-500/20 hover:bg-green-500/40 px-3 py-1 rounded-xl text-green-400 font-semibold transition text-sm cursor-pointer"
                  >
                    Activate
                  </button>
                )}
                {election.status === "Live" && (
                  <button
                    onClick={() => openModal("inactive", election.id)}
                    className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-xl text-red-400 font-semibold transition text-sm cursor-pointer"
                  >
                    Inactive
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

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
          Manage Elections
        </h2>
        <p className="text-gray-400 text-sm">
          View, edit, or delete elections. Activate upcoming elections or mark
          live elections as inactive. Completed elections are shown below.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="px-4 sm:px-6 pb-6 max-w-6xl mx-auto w-full overflow-x-auto"
      >
        {activeElections.length > 0 && renderTable(activeElections)}
      </motion.section>

      {completedElections.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-4 sm:px-6 pb-12 max-w-6xl mx-auto w-full overflow-x-auto"
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Completed Elections
          </h3>
          {renderTable(completedElections)}
        </motion.section>
      )}

      {/* Confirm Activation/Inactivation Modal */}
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
                Confirm{" "}
                {modal.type === "activate" ? "Activation" : "Inactivation"}
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to{" "}
                {modal.type === "activate" ? "activate" : "mark inactive"} this
                election?
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={confirmAction}
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

      {/* Candidate Modal */}
      <AnimatePresence>
        {candidateModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl max-w-md w-full text-center overflow-y-auto max-h-[80vh]"
            >
              <h3 className="text-lg font-bold mb-4 text-gray-100">
                Candidates
              </h3>
              <div className="flex flex-col gap-3">
                {candidateModal.candidates.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/5 p-3 rounded-lg text-gray-200 font-medium"
                  >
                    {c.name}
                  </motion.div>
                ))}
              </div>
              <button
                onClick={closeCandidateModal}
                className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* LIST FORMAT  
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export default function ManageElections() {
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "Presidential Election 2024",
      startDateTime: "2024-11-01T09:00",
      endDateTime: "2024-11-01T17:00",
      status: "Live",
      votes: 123456,
    },
    {
      id: 2,
      title: "University Senate Election",
      startDateTime: "2024-09-15T10:00",
      endDateTime: "2024-09-15T15:00",
      status: "Completed",
      votes: 2548,
    },
    {
      id: 3,
      title: "Local Council Election",
      startDateTime: "2024-10-01T08:00",
      endDateTime: "2024-10-01T18:00",
      status: "Upcoming",
      votes: 0,
    },
  ]);

  const [modal, setModal] = useState({ open: false, type: "", electionId: null });

  const handleEdit = (id) => alert(`Edit election ${id}`);
  const handleDelete = (id) => alert(`Delete election ${id}`);
  const openModal = (type, electionId) => setModal({ open: true, type, electionId });
  const closeModal = () => setModal({ open: false, type: "", electionId: null });

  const confirmAction = () => {
    const { electionId, type } = modal;
    setElections((prev) =>
      prev.map((e) => {
        if (e.id === electionId) {
          if (type === "activate") return { ...e, status: "Live" };
          if (type === "inactive") return { ...e, status: "Completed" };
        }
        return e;
      })
    );
    closeModal();
  };

  const activeElections = elections.filter((e) => e.status === "Live" || e.status === "Upcoming");
  const completedElections = elections.filter((e) => e.status === "Completed");

  const renderTable = (data, isCompleted = false) => (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {data.map((election, idx) => {
        const start = new Date(election.startDateTime);
        const end = new Date(election.endDateTime);

        return (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white/5 backdrop-blur-lg rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-colors`}
          >
            {/* Desktop Table Row 
            <div className="hidden sm:grid sm:grid-cols-7 sm:items-center gap-2">
              <div>
                <span className="text-gray-400 text-xs block">Title</span>
                <span className="font-semibold text-gray-200">{election.title}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Start Date</span>
                <span>{start.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Start Time</span>
                <span>{start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">End Time</span>
                <span>{end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Status</span>
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                    election.status === "Live"
                      ? "bg-cyan-400/20 text-cyan-400"
                      : election.status === "Upcoming"
                      ? "bg-purple-400/20 text-purple-400"
                      : "bg-green-400/20 text-green-400"
                  }`}
                >
                  {election.status}
                </motion.span>
              </div>
              <div>
                <span className="text-gray-400 text-xs block">Votes</span>
                <span>{election.votes.toLocaleString()}</span>
              </div>
              <div className="flex justify-center gap-2 flex-wrap">
                <button
                  onClick={() => handleEdit(election.id)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 p-2 rounded-xl transition"
                >
                  <Edit className="h-4 w-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(election.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-xl transition"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
                {election.status === "Upcoming" && (
                  <button
                    onClick={() => openModal("activate", election.id)}
                    className="bg-green-500/20 hover:bg-green-500/40 px-3 py-1 rounded-xl text-green-400 font-semibold transition text-sm"
                  >
                    Activate
                  </button>
                )}
                {election.status === "Live" && (
                  <button
                    onClick={() => openModal("inactive", election.id)}
                    className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-xl text-red-400 font-semibold transition text-sm"
                  >
                    Inactive
                  </button>
                )}
              </div>
            </div>

            {/* Mobile View 
            <div className="sm:hidden flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-200">{election.title}</span>
                <div className="flex gap-1 flex-wrap">
                  {election.status === "Upcoming" && (
                    <button
                      onClick={() => openModal("activate", election.id)}
                      className="bg-green-500/20 hover:bg-green-500/40 px-2 py-1 rounded-xl text-green-400 font-semibold text-xs"
                    >
                      Activate
                    </button>
                  )}
                  {election.status === "Live" && (
                    <button
                      onClick={() => openModal("inactive", election.id)}
                      className="bg-red-500/20 hover:bg-red-500/40 px-2 py-1 rounded-xl text-red-400 font-semibold text-xs"
                    >
                      Inactive
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm flex-wrap gap-1">
                <div>
                  <span className="font-semibold">Date:</span> {start.toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Start:</span>{" "}
                  {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div>
                  <span className="font-semibold">End:</span>{" "}
                  {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div>
                  <span className="font-semibold">Votes:</span> {election.votes.toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      election.status === "Live"
                        ? "bg-cyan-400/20 text-cyan-400"
                        : election.status === "Upcoming"
                        ? "bg-purple-400/20 text-purple-400"
                        : "bg-green-400/20 text-green-400"
                    }`}
                  >
                    {election.status}
                  </motion.span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => handleEdit(election.id)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 p-2 rounded-xl transition"
                >
                  <Edit className="h-4 w-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(election.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-xl transition"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <AdminNavbar />

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-6 max-w-6xl mx-auto w-full"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Manage Elections</h2>
        <p className="text-gray-400 text-sm">
          View, edit, or delete elections. Activate upcoming elections or mark live elections as inactive. Completed elections are shown below.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="px-4 sm:px-6 pb-6 max-w-6xl mx-auto w-full overflow-x-auto"
      >
        {activeElections.length > 0 && renderTable(activeElections)}
      </motion.section>

      {completedElections.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-4 sm:px-6 pb-12 max-w-6xl mx-auto w-full overflow-x-auto"
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-4">Completed Elections</h3>
          {renderTable(completedElections, true)}
        </motion.section>
      )}

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
                Confirm {modal.type === "activate" ? "Activation" : "Inactivation"}
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to {modal.type === "activate" ? "activate" : "mark inactive"} this election?
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={confirmAction}
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
} */

/* TABLE FORMAT
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import AdminNavbar from "./AdminNavbar";

export default function ManageElections() {
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "Presidential Election 2024",
      startDateTime: "2024-11-01T09:00",
      endDateTime: "2024-11-01T17:00",
      status: "Live",
      votes: 123456,
    },
    {
      id: 2,
      title: "University Senate Election",
      startDateTime: "2024-09-15T10:00",
      endDateTime: "2024-09-15T15:00",
      status: "Completed",
      votes: 2548,
    },
    {
      id: 3,
      title: "Local Council Election",
      startDateTime: "2024-10-01T08:00",
      endDateTime: "2024-10-01T18:00",
      status: "Upcoming",
      votes: 0,
    },
  ]);

  const [modal, setModal] = useState({
    open: false,
    type: "",
    electionId: null,
  });

  const handleEdit = (id) => alert(`Edit election ${id}`);
  const handleDelete = (id) => alert(`Delete election ${id}`);

  const openModal = (type, electionId) =>
    setModal({ open: true, type, electionId });
  const closeModal = () =>
    setModal({ open: false, type: "", electionId: null });

  const confirmAction = () => {
    const { electionId, type } = modal;
    setElections((prev) =>
      prev.map((e) => {
        if (e.id === electionId) {
          if (type === "activate") return { ...e, status: "Live" };
          if (type === "inactive") return { ...e, status: "Completed" };
        }
        return e;
      })
    );
    closeModal();
  };

  const activeElections = elections.filter(
    (e) => e.status === "Live" || e.status === "Upcoming"
  );
  const completedElections = elections.filter((e) => e.status === "Completed");

  const renderTable = (data, isCompleted = false) => (
    <motion.table
      className="min-w-full table-auto border-collapse border border-white/20 rounded-2xl overflow-hidden mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <thead className="bg-white/10 backdrop-blur-lg">
        <tr>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            Title
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            Start Date
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            Start Time
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            End Time
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            Status
          </th>
          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
            Votes
          </th>
          <th className="px-4 py-3 text-center text-sm font-semibold text-gray-300">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((election, idx) => {
          const start = new Date(election.startDateTime);
          const end = new Date(election.endDateTime);

          return (
            <motion.tr
              key={election.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`hover:bg-white/5 transition-colors cursor-pointer ${
                isCompleted ? "bg-white/5" : ""
              }`}
            >
              <td className="px-4 py-3">{election.title}</td>
              <td className="px-4 py-3">{start.toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </td>
              <td className="px-4 py-3">
                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </td>
              <td className="px-4 py-3">
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                    election.status === "Live"
                      ? "bg-cyan-400/20 text-cyan-400"
                      : election.status === "Upcoming"
                      ? "bg-purple-400/20 text-purple-400"
                      : "bg-green-400/20 text-green-400"
                  }`}
                >
                  {election.status}
                </motion.span>
              </td>
              <td className="px-4 py-3">{election.votes.toLocaleString()}</td>
              <td className="px-4 py-3 flex justify-center gap-2">
                <button
                  onClick={() => handleEdit(election.id)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/40 p-2 rounded-xl transition"
                >
                  <Edit className="h-4 w-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => handleDelete(election.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 p-2 rounded-xl transition"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>

                {election.status === "Upcoming" && (
                  <button
                    onClick={() => openModal("activate", election.id)}
                    className="bg-green-500/20 hover:bg-green-500/40 px-3 py-1 rounded-xl text-green-400 font-semibold transition text-sm"
                  >
                    Activate
                  </button>
                )}
                {election.status === "Live" && (
                  <button
                    onClick={() => openModal("inactive", election.id)}
                    className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded-xl text-red-400 font-semibold transition text-sm"
                  >
                    Inactive
                  </button>
                )}
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </motion.table>
  );

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
          Manage Elections
        </h2>
        <p className="text-gray-400 text-sm">
          View, edit, or delete elections. Activate upcoming elections or mark
          live elections as inactive. Completed elections are shown below.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="px-6 pb-6 max-w-6xl mx-auto w-full overflow-x-auto"
      >
        {activeElections.length > 0 && renderTable(activeElections)}
      </motion.section>

      {completedElections.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="px-6 pb-12 max-w-6xl mx-auto w-full overflow-x-auto"
        >
          <h3 className="text-xl font-semibold text-gray-300 mb-4">
            Completed Elections
          </h3>
          {renderTable(completedElections, true)}
        </motion.section>
      )}

      {/* Confirmation Modal 
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
                Confirm{" "}
                {modal.type === "activate" ? "Activation" : "Inactivation"}
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to{" "}
                {modal.type === "activate" ? "activate" : "mark inactive"} this
                election?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmAction}
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
*/
