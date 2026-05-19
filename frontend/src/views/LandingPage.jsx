import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen w-full bg-[#020617] text-white overflow-y-auto">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-amber-500" size={32} />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
            Aura AI
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-amber-400 transition">Features</a>
          <a href="#workflow" className="hover:text-amber-400 transition">Workflow</a>
          <a href="#about" className="hover:text-amber-400 transition">About</a>
        </div>
        <Link to="/dashboard">
          <button className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition backdrop-blur-md">
            Go to App
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center text-center px-4 py-32 mt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-yellow-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sm text-amber-300 mb-6">
            <Sparkles size={16} />
            <span>The Next Generation of AI Workflows</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
            Automate with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-600">
              Aura Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Transform raw data into enterprise-grade models in seconds. Experience the most advanced automated data science platform ever built.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 font-medium text-lg flex items-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-shadow"
              >
                Start Building <ArrowRight size={20} />
              </motion.button>
            </Link>
            <button className="px-8 py-4 rounded-full glass-panel hover:bg-white/10 font-medium text-lg transition">
              View Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div id="features" className="py-24 px-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-8 z-10 relative">
        <div className="glass-panel p-8 hover:border-amber-500/50 transition duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Zap className="text-amber-400" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Lightning Fast Auto-ML</h3>
          <p className="text-gray-400">Our engine automatically analyzes, cleans, and trains the best performing models for your dataset instantly.</p>
        </div>
        <div className="glass-panel p-8 hover:border-yellow-500/50 transition duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <BrainCircuit className="text-yellow-400" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
          <p className="text-gray-400">Aura AI detects problem types and recommends optimal algorithms based on data structure and patterns.</p>
        </div>
        <div className="glass-panel p-8 hover:border-orange-500/50 transition duration-300 group">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition">
            <Shield className="text-orange-400" size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Enterprise Grade Security</h3>
          <p className="text-gray-400">Your data is processed in a secure environment with state-of-the-art encryption and compliance built-in.</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 border-t border-white/10 mt-20">
        <p>© 2026 Aura AI Platform. Designed for Enterprise.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
