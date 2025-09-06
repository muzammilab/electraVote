import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LandingPage() {
  const canvasRef = useRef(null);
  const [activeElection, setActiveElection] = useState([]);

  useEffect(() => {

    const activeElection = async () => {
    try {
        const response = await axios.get('http://localhost:3001/election/active');
        console.log("Active Election For Landing Page : ",response.data);
        setActiveElection(response.data.activeElection);
    } catch (error) {
      console.error('Error fetching active elections:', error);
    }
  }
    activeElection();
  }, []);

  function formatTime(time24) {
    if (!time24) return ""; // return empty string if time24 is undefined or null
    
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  }

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col">

      {/* Particle background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

      {/* Gradient overlay for subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900 animate-gradient-background z-[-1]"></div>

      {/* Navbar */}
      <motion.header 
        className="w-full py-4 px-4 sm:px-8 flex items-center justify-between relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl sm:text-2xl font-black">E</div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold">ElectraVote</div>
            <div className="text-xs text-gray-300">Secure • Transparent • Auditable</div>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link 
            to="/login" 
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-cyan-500 font-semibold shadow hover:scale-105 hover:shadow-xl transition-transform duration-300 text-sm sm:text-base"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
          >
            Register
          </Link>
        </nav>
      </motion.header>

      {/* Hero */}
      <main className="flex-1 flex items-center relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
          
          {/* Left Section */}
          <motion.section 
            className="space-y-4 sm:space-y-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-snug sm:leading-tight">
              The future of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
                secure voting
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-300 max-w-full sm:max-w-xl">
              Quantum-secured E-Voting with blockchain-backed audit trails — fast, private, and verifiable. Designed for governments, universities, and organizations.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
              <Link 
                to="/login" 
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-cyan-500 font-semibold shadow hover:scale-105 hover:shadow-xl transition-transform duration-300 text-sm sm:text-base"
              >
                Cast Your Vote
              </Link>
              <Link 
                to="/voter/results" 
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-white/10 border border-white/5 hover:bg-white/20 transition duration-300 text-sm sm:text-base"
              >
                Live Results
              </Link>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-full sm:max-w-md">
              {[{ label: 'Turnout', value: '42%' }, { label: 'Elections', value: '1 Active' }, { label: 'Integrity', value: 'Blockchain' }, { label: 'Latency', value: '<0.5s' }].map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="p-2 sm:p-3 bg-white/5 rounded-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * idx }}
                >
                  <div className="text-xs sm:text-sm text-gray-300">{item.label}</div>
                  <div className="font-bold text-sm sm:text-base">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Right Section - Election Card */}
          <motion.aside 
            className="bg-white/5 border border-white/6 rounded-3xl p-4 sm:p-6 shadow-lg hover:scale-105 transition-transform duration-300"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <div className="text-sm text-gray-300">Current Election</div>
                <div className="text-xl font-bold">{activeElection?.title}</div>
                <div className="text-sm text-gray-400 mt-2">
                  Started at {formatTime(activeElection?.startTime)} • {activeElection?.startDate ? new Date(activeElection.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", }) : ""}
                </div>

                <div className="text-sm text-gray-400 mt-2">Ends {formatTime(activeElection?.endTime)} • Live</div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="text-3xl font-black">123,456</div>
                <div className="text-sm text-gray-300">Votes</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-gray-300 mb-2">Progress</div>
              <div className="w-full bg-white/8 rounded-full h-3 overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link to="/login" className="flex-1 px-4 py-2 rounded-xl bg-cyan-500 text-sm font-semibold text-white hover:scale-105 transition-transform duration-300 text-center">Authenticate & Vote</Link>
              <Link to="/voter/results" className="flex-1 px-4 py-2 rounded-xl bg-white/5 text-sm hover:bg-white/20 transition duration-300 text-center">View Results</Link>
            </div>
          </motion.aside>
        
        </div>
      </main>

      {/* Features */}
      <motion.section 
        id="features" 
        className="bg-white/2 py-10 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <h3 className="text-2xl font-bold text-white mb-6 text-center sm:text-left">Why ElectraVote?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ title: 'End-to-end verifiability', desc: 'Every vote is auditable without compromising voter privacy.' },
              { title: 'Quantum-secure crypto', desc: 'Post-quantum algorithms reduce future cryptographic risk.' },
              { title: 'Fast & accessible', desc: 'Designed for millions of voters with low-latency flows.' }].map((feature, idx) => (
              <motion.div 
                key={idx}
                className="p-6 bg-white/5 rounded-2xl hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * idx }}
              >
                <div className="font-semibold mb-2">{feature.title}</div>
                <div className="text-sm text-gray-300">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="py-6 px-4 sm:px-8 text-sm text-gray-300 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div>© {new Date().getFullYear()} VoteChain — Built with security in mind.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
