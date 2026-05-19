import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, BarChart3, Settings, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Data Hub', path: '/upload', icon: <Database size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen glass-panel rounded-none border-y-0 border-l-0 flex flex-col pt-8 pb-4">
      <div className="flex items-center gap-3 px-6 mb-10">
        <BrainCircuit className="text-amber-500" size={32} />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500">
          Aura AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.name} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 glow-text' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-amber-500 rounded-r-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="px-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-white/10">
          <p className="text-xs text-gray-400 mb-2">Enterprise Plan</p>
          <div className="w-full bg-gray-700 h-1.5 rounded-full mb-1">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-1.5 rounded-full w-3/4"></div>
          </div>
          <p className="text-[10px] text-gray-500">75% GPU hours used</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
