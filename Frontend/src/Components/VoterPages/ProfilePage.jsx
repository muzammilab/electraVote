import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Save,
  X,
  UserCircle2,
  CheckCircle2,
  Calendar,
  Hash,
  MapPin,
  Mail,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoterNavbar from "./VoterNavbar";
import axios from "axios";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [user, setUser] = useState([]);

  const [formData, setFormData] = useState({
    name: user.name,
    dob: user.dob,
    address: user.address,
    aadharCardNumber: user.aadharCardNumber,
    email: user.email,
    phone: user.phone,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        const userRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User Data :", userRes.data);
        setUser(userRes.data.user);

        // ✅ update formData as well
        setFormData({
          name: userRes.data.user.name || "",
          dob: userRes.data.user.dob || "",
          address: userRes.data.user.address || "",
          aadharCardNumber: userRes.data.user.aadharCardNumber || "",
          email: userRes.data.user.email || "",
          phone: userRes.data.user.phone || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  // Update age when dob changes
  useEffect(() => {
    const birthDate = new Date(formData.dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    setUser((prev) => ({
      ...prev,
      age: Math.abs(ageDate.getUTCFullYear() - 1970),
    }));
  }, [formData.dob]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...user, ...formData });
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      dob: user.dob,
      address: user.address,
      aadharCardNumber: user.aadharCardNumber,
      email: user.email,
      phone: user.phone,
    });
    setIsEditing(false);
  };

  const fields = [
    {
      name: "name",
      label: "Name",
      icon: <UserCircle2 className="h-5 w-5 text-pink-400" />,
      editable: true,
    },
    {
      name: "dob",
      label: "DOB",
      icon: <Calendar className="h-5 w-5 text-cyan-400" />,
      editable: true,
    },
    {
      name: "age",
      label: "Age",
      icon: <Calendar className="h-5 w-5 text-purple-400" />,
      editable: false,
    },
    {
      name: "address",
      label: "Address",
      icon: <MapPin className="h-5 w-5 text-green-400" />,
      editable: true,
    },
    {
      name: "aadharCardNumber",
      label: "Aadhar Number",
      icon: <Hash className="h-5 w-5 text-yellow-400" />,
      editable: true,
    },
    {
      name: "email",
      label: "Email",
      icon: <Mail className="h-5 w-5 text-pink-400" />,
      editable: true,
    },
    {
      name: "phone",
      label: "Phone",
      icon: <Smartphone className="h-5 w-5 text-cyan-400" />,
      editable: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      {/* Navbar */}
      <VoterNavbar name={user.name} email={user.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voter/dashboard")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full text-center"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
          Your <span className="text-pink-400">Profile</span>
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Manage and update your voter details below.
        </p>
      </motion.section>

      {/* Profile Card */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-start justify-center px-4 sm:px-6 pb-12"
      >
        <motion.div
          layout
          className="w-full max-w-4xl bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Avatar Section */}
            <motion.div
              layout
              className="flex flex-col items-center justify-center bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-6 md:p-8"
            >
              <motion.div
                layout
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="rounded-full bg-white/20 shadow-lg flex items-center justify-center"
                style={{ width: 112, height: 112 }}
              >
                <UserCircle2 className="text-pink-400 w-full h-full" />
              </motion.div>
              <motion.h3
                layout
                className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-center"
              >
                {user?.name}
              </motion.h3>
              <motion.p
                layout
                className="text-gray-300 text-xs sm:text-sm text-center"
              >
                {user?.email}
              </motion.p>
            </motion.div>

            {/* Details Section */}
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {fields.map((field) => (
                      <div key={field?.name} className="flex flex-col">
                        <label className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                          {field.icon} {field.label}
                        </label>
                        {field.name === "dob" ? (
                          <DatePicker
                            selected={new Date(formData.dob)}
                            onChange={(date) =>
                              setFormData({
                                ...formData,
                                dob: date.toISOString().split("T")[0],
                              })
                            }
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white/20 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-xs sm:text-sm w-full"
                            dateFormat="yyyy-MM-dd"
                            maxDate={new Date()}
                          />
                        ) : (
                          <input
                            type="text"
                            name={field?.name}
                            value={
                              field.editable
                                ? formData[field?.name]
                                : user[field?.name]
                            }
                            onChange={field.editable ? handleChange : undefined}
                            disabled={!field.editable}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl 
                            ${
                              field.editable
                                ? "bg-white/20 border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                : "bg-white/10 border-white/20 text-gray-300 cursor-not-allowed"
                            } 
                            transition text-xs sm:text-sm w-full`}
                          />
                        )}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="view"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                  >
                    {fields.map((field) => (
                      <div key={field.name} className="flex flex-col">
                        <label className="text-xs sm:text-sm text-gray-400 mb-1 flex items-center gap-1">
                          {field.icon} {field.label}
                        </label>
                        <p className="text-gray-200 font-semibold text-sm sm:text-base">
                          {field.name === "dob" && user.dob
                            ? new Date(user.dob).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : user[field.name] !== undefined &&
                              user[field.name] !== null
                            ? String(user[field.name])
                            : ""}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="editing-buttons"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex gap-3 flex-col sm:flex-row"
                    >
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-500/30 hover:bg-gray-500/50 text-sm sm:text-base transition"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-green-500/40 transition"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="view-button"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-pink-500/40 transition"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-sm sm:text-base"
          >
            <CheckCircle2 className="h-5 w-5 text-white" />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
