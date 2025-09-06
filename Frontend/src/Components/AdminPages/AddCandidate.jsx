import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Award, Image, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";

export default function AddCandidate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    age: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState(null);

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
            console.log("Getting Admin Details");
            console.log(adminRes.data);
            setAdmin(adminRes.data.user);
          } catch (err) {
            console.error("Error fetching voter data:", err);
          }
        };
    
        fetchUserData();
      }, []);

  // handle text input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

  // submit candidate
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("party", formData.party);
      payload.append("age", formData.age);
      if (formData.logo) {
        payload.append("logo", formData.logo);
      }

      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.post(
        "http://localhost:3001/candidate/create",
        payload,
        {
          headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
          },
        }
      );

      console.log("✅ Candidate created:", res.data);
      alert("Candidate added successfully!");
      navigate("/admin/candidates/list");
    } catch (err) {
      console.error("❌ Error adding candidate:", err);
      alert("Error adding candidate");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <AdminNavbar name={admin?.name} email={admin?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/admin/candidates/list")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-6 max-w-3xl mx-auto w-full"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Add Candidate
        </h2>
        <p className="text-gray-400 text-sm">
          Enter candidate details and upload party logo.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-6 pb-12 max-w-3xl mx-auto w-full"
      >
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <UserPlus className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-200">
                New Candidate
              </h3>
              <p className="text-gray-400 text-sm">Fill in details below</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Candidate Name"
              required
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <input
              type="text"
              name="party"
              value={formData.party}
              onChange={handleChange}
              placeholder="Party Name"
              required
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />

            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition">
              <Image className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-300 text-sm">
                {formData.logo ? formData.logo.name : "Upload Party Logo"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            
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

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Award className="h-5 w-5" />
            Add Candidate
          </motion.button>
        </motion.form>
      </motion.section>
    </div>
  );
}


/* SUPPORTS MULTIPLE CANDIDATES ADDITION - INCOMPLETE FEATURE  
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Award, X, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

export default function AddCandidate() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    party: "",
    age: "",
    logo: null,
  });

  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
    logo: null,
  });

  // handle text inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleChange = (e) => {
  //   setNewCandidate({ ...newCandidate, [e.target.name]: e.target.value });
  // };

  // handle file input
  const handleLogoUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      logo: e.target.files[0],
    }));
  };

  // const handleLogoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setNewCandidate({ ...newCandidate, logo: URL.createObjectURL(file) });
  //   }
  // };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.party || !newCandidate.age) return;
    setCandidates([...candidates, newCandidate]);
    setNewCandidate({ name: "", party: "", age: "", logo: null });
  };

  const handleRemoveCandidate = (index) => {
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // build payload using FormData (since file upload required)
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("party", formData.party);
    payload.append("age", formData.age);
    if (formData.logo) payload.append("logo", formData.logo);

    try {
      await axios.post("http://localhost:5000/candidate/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Candidate added successfully!");
      navigate("/admin/manage-elections");
    } catch (error) {
      console.error(error);
      alert("Error adding candidate");
    }
  };

  // const handleSubmit = () => {
  //   // TODO: Integrate with backend API
  //   console.log("Candidates added:", candidates);
  //   navigate("/admin/manage-elections");
  // };

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
          Add Candidates
        </h2>
        <p className="text-gray-400 text-sm">
          Add candidates for the selected election. You can add multiple
          candidates.
        </p>
      </motion.section>

      {/* Candidate Input Card 
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-6 pb-12 max-w-6xl mx-auto w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <UserPlus className="h-12 w-12 text-cyan-400 drop-shadow-lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-200">
                Add New Candidate
              </h3>
              <p className="text-gray-400 text-sm">
                Enter candidate details below
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={newCandidate.name}
              onChange={handleChange}
              placeholder="Candidate Name"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <input
              type="text"
              name="party"
              value={newCandidate.party}
              onChange={handleChange}
              placeholder="Party Name"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <input
              type="number"
              name="age"
              value={newCandidate.age}
              onChange={handleChange}
              placeholder="Age"
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition">
              <Image className="h-5 w-5 text-cyan-400" />
              <span className="text-gray-300 text-sm">
                {newCandidate.logoName || "Upload Party Logo"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewCandidate({
                      ...newCandidate,
                      logo: URL.createObjectURL(file),
                      logoName: file.name,
                    });
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <motion.button
            onClick={handleAddCandidate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Award className="h-5 w-5" />
            Add Candidate
          </motion.button>
        </motion.div>

        {/* Display Added Candidates 
        {candidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {candidates.map((c, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg relative border border-white/20"
              >
                <div
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => handleRemoveCandidate(index)}
                >
                  <X className="h-5 w-5 text-red-400" />
                </div>

                <div className="flex items-center gap-3 mb-2">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt="Party Logo"
                      className="h-10 w-10 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <Image className="h-10 w-10 text-gray-400" />
                  )}
                  <div>
                    <h4 className="text-gray-100 font-semibold">{c.name}</h4>
                    <p className="text-gray-400">{c.party}</p>
                  </div>
                </div>
                <p className="text-gray-300">Age: {c.age}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {candidates.length > 0 && (
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-full bg-yellow-400/80 hover:bg-yellow-400 text-gray-900 py-2 px-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Award className="h-5 w-5" />
            Submit All Candidates
          </motion.button>
        )}
      </motion.section>
    </div>
  );
}
 */