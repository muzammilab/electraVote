import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

export default function AdminClosedElections() {
  const navigate = useNavigate();

  // Fetch admin and closed elections details to display name in navbar & closed elections in table
  const [admin, setAdmin] = useState();
  const [closedElections, setClosedElections] = useState([]);

  function formatTime(time24) {
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const fetchData = async () => {
      try {
        const adminRes = await axios.get("http://localhost:3001/user/single", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Admin Data :", adminRes.data);
        setAdmin(adminRes.data.user);

        const electionRes = await axios.get(
          "http://localhost:3001/election/closed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Closed Elections Data :", electionRes.data);
        setClosedElections(electionRes.data.closedElections);
      } catch (err) {
        console.error("Error fetching Admin data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 text-white">
      <AdminNavbar name={admin?.name} email={admin?.email} />

      {/* Back Button */}
      <div className="px-6 py-6 flex relative z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          // onClick={() => navigate("/voter/dashboard")}
          onClick={() => navigate("/admin/elections")}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-pink-500/20 hover:from-cyan-500/30 hover:to-pink-500/30 transition text-gray-200 font-medium shadow-md hover:shadow-lg backdrop-blur-md cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </motion.button>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400 drop-shadow-lg mb-10"
        >
          Election Results
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-gray-200 font-semibold">
                    Election Name
                  </th>
                  <th className="px-6 py-3 text-gray-200 font-semibold">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-gray-200 font-semibold">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-gray-200 font-semibold">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-gray-200 font-semibold text-center">
                    Winner
                  </th>
                  <th className="px-6 py-3 text-gray-200 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {closedElections.map((election, index) => (
                  <motion.tr
                    key={election._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="border-t border-white/10 hover:bg-white/10 transition"
                  >
                    <td className="px-6 py-4 text-gray-100">
                      {election?.title}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(election?.startDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      
                      {formatTime(election?.startTime)}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {formatTime(election?.endTime)}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2 text-gray-100">
                      <img
                        src={election?.winner?.logo}
                        alt={election?.winner?.party}
                        className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                      />
                      {election.winner.name}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          navigate(`/admin/${election?._id}/results`)
                        }
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-pink-500/40 transition cursor-pointer"
                      >
                        View Result
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
