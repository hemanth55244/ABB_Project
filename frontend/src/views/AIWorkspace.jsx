import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Brain, Server, Target, Zap, Clock, PlayCircle } from 'lucide-react';

const mockData = [
  { name: 'Random Forest', score: 0.85 },
  { name: 'Gradient Boosting', score: 0.88 },
  { name: 'Logistic Reg', score: 0.78 },
  { name: 'Decision Tree', score: 0.72 },
];

const mockInsights = [
  { title: 'High Correlation', desc: 'Age and Income show 0.85 correlation.' },
  { title: 'Missing Data Handled', desc: 'Imputed 145 values in "Salary".' },
  { title: 'Class Imbalance', desc: 'Target variable skewed 70/30.' },
];

const AIWorkspace = () => {
  const [training, setTraining] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startTraining = () => {
    setTraining(true);
    setTimeout(() => {
      setTraining(false);
      setCompleted(true);
    }, 3000);
  };

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Workspace</h1>
          <p className="text-gray-400">Model training and performance analytics.</p>
        </div>
        {!completed ? (
          <button 
            onClick={startTraining}
            disabled={training}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 flex items-center gap-2 font-medium disabled:opacity-50"
          >
            {training ? <Activity className="animate-spin" size={18} /> : <PlayCircle size={18} />}
            {training ? 'Training Models...' : 'Start Auto-ML Pipeline'}
          </button>
        ) : (
          <div className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-2 font-medium text-sm">
            <Zap size={16} /> Pipeline Completed
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-amber-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium">Problem Type</p>
            <Target size={18} className="text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold">Classification</h3>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-yellow-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium">Dataset Rows</p>
            <Server size={18} className="text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold">891</h3>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-orange-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium">Models Trained</p>
            <Brain size={18} className="text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold">{completed ? '4' : '0'}</h3>
        </div>
        <div className="glass-panel p-5 rounded-xl border-t-4 border-t-green-500">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm font-medium">Process Time</p>
            <Clock size={18} className="text-green-400" />
          </div>
          <h3 className="text-2xl font-bold">{completed ? '3.2s' : '-'}</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 glass-panel p-6">
          <h3 className="text-xl font-bold mb-6">Model Performance (Accuracy)</h3>
          <div className="h-80 w-full relative">
            {!completed ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-white/5 rounded-xl">
                {training ? 'Training in progress...' : 'Run pipeline to see results'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
                    itemStyle={{ color: '#c084fc' }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {mockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#eab308' : '#f59e0b'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap size={18} className="text-amber-400" /> AI Insights
            </h3>
            {completed ? (
              <div className="space-y-4">
                {mockInsights.map((insight, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    key={i} 
                    className="p-4 rounded-xl bg-white/5 border border-white/5"
                  >
                    <h4 className="font-medium text-sm text-amber-300 mb-1">{insight.title}</h4>
                    <p className="text-xs text-gray-400">{insight.desc}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-8">
                Insights will appear after training.
              </div>
            )}
          </div>
          
          <div className="glass-panel p-6 bg-gradient-to-br from-amber-900/20 to-yellow-900/20">
            <h3 className="text-lg font-bold mb-2">Export Report</h3>
            <p className="text-sm text-gray-400 mb-4">Generate a full PDF report of the analysis and model performance.</p>
            <button disabled={!completed} className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition font-medium text-sm disabled:opacity-50">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWorkspace;
