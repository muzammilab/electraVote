import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Plus, X, User, Layers, Briefcase, Image } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import VoterNavbar from "./VoterNavbar";
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

  const [user, setUser] = useState();
  const [election, setElection] = useState(null); // store election
  const [candidates, setCandidates] = useState([]); // store candidates of a particular election

  const colors = [
    "from-pink-500/20 to-pink-700/20 border-pink-400/30 hover:shadow-pink-500/40",
    "from-indigo-500/20 to-indigo-700/20 border-indigo-400/30 hover:shadow-indigo-500/40",
    "from-purple-500/20 to-purple-700/20 border-purple-400/30 hover:shadow-purple-500/40",
    "from-green-500/20 to-green-700/20 border-green-400/30 hover:shadow-green-500/40",
  ];

  // fetch voter for navbar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("http://localhost:3001/user/single", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // fetch election by id (with candidates)
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


  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <VoterNavbar name={user?.name} email={user?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/elections/upcoming")}
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
              {election?.title || "Undefined Election"}
            </motion.div>
          </h2>
          
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

              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* All Cards have same colour 
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CandidateList() {
  const [candidates] = useState([
    { 
      id: 1, 
      name: "Kashif Shaikh", 
      dept: "Computer Engineering", 
      party: "Tech Visionaries", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_example.png"
    },
    { 
      id: 2, 
      name: "Michael Lee", 
      dept: "Mechanical Engineering", 
      party: "Innovation First", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/React.svg/1200px-React.svg.png"
    },
    { 
      id: 3, 
      name: "Sophia Patel", 
      dept: "Electrical Engineering", 
      party: "Green Future", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png"
    },
    { 
      id: 4, 
      name: "David Kim", 
      dept: "Civil Engineering", 
      party: "United Builders", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
    },
    { 
      id: 5, 
      name: "Rohan Mehta", 
      dept: "Civil Engineering", 
      party: "United Builders", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
    },
    { 
      id: 6, 
      name: "Aisha Khan", 
      dept: "Civil Engineering", 
      party: "United Builders", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      
      {/* Back Button 
      <div className="px-6 py-4">
        <button className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition font-medium">
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      {/* Title 
      <main className="flex-1 flex flex-col items-center px-6 py-6">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-100">
            Meet the <span className="text-pink-400">Candidates</span>
          </h2>

          {/* Candidate Cards 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg border border-pink-500/20 rounded-2xl shadow-xl p-6 hover:shadow-pink-500/40 transition flex flex-col items-center text-center space-y-4"
              >
                {/* Party Logo 
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
                  <img 
                    src={candidate.logo} 
                    alt={candidate.party} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info 
                <h3 className="text-lg font-bold text-gray-100">{candidate.name}</h3>
                <p className="text-sm text-gray-400">{candidate.dept}</p>
                <p className="text-sm font-medium text-pink-400">{candidate.party}</p>

                {/* Action Button 
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md hover:shadow-pink-500/40 transition">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
 */