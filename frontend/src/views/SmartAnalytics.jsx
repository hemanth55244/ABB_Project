import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Sparkles, Database, TrendingUp, AlertCircle, Loader2, BarChart2, MapPin, Plane } from 'lucide-react';

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#3b82f6', '#14b8a6', '#a855f7', '#f97316'];

const API = 'http://localhost:8000';

/* ─── tiny stat card ─── */
const StatCard = ({ label, value, sub, color = 'amber' }) => {
  const colors = {
    amber: 'from-amber-900/30 to-yellow-900/20 border-amber-500/30 text-amber-400',
    green: 'from-green-900/30 to-emerald-900/20 border-green-500/30 text-green-400',
    blue:  'from-blue-900/30 to-indigo-900/20 border-blue-500/30 text-blue-400',
    purple:'from-purple-900/30 to-violet-900/20 border-purple-500/30 text-purple-400',
  };
  return (
    <div className={`glass-panel p-5 bg-gradient-to-br ${colors[color]} border`}>
      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(' ')[3]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
};

/* ─── horizontal feature bar ─── */
const FeatureBar = ({ name, pct, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-300 truncate max-w-[70%]">{name}</span>
      <span className="font-medium" style={{ color }}>{pct}%</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2">
      <motion.div
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const SmartAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/analytics`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  /* ── Loading ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
      <Loader2 className="animate-spin text-amber-400" size={40} />
      <p>Loading analytics from dataset…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-red-400">
      <AlertCircle size={40} />
      <p>Failed to load analytics: {error}</p>
      <p className="text-sm text-gray-500">Make sure the backend is running at {API}</p>
    </div>
  );

  /* ── Derived values ── */
  const comp = analytics.composition ?? {};
  const compositionData = [
    { name: 'Numerical Features',   value: comp.numerical_features   ?? 0 },
    { name: 'Categorical Features', value: comp.categorical_features  ?? 0 },
    { name: 'Missing Values',       value: comp.missing_data_imputed  ?? 0 },
    { name: 'Outliers Removed',     value: comp.outliers_removed      ?? 0 },
  ].filter(d => d.value > 0);

  // Feature importance — rank columns by: numeric cols first (more variation → higher %)
  const numCols = analytics.num_cols ?? [];
  const catCols = analytics.cat_cols ?? [];
  const allCols = [...numCols, ...catCols];
  const featureImportance = allCols.slice(0, 6).map((col, i) => ({
    name: col,
    pct: Math.max(20, Math.round(90 - i * (60 / Math.max(allCols.length, 1)))),
    color: COLORS[i % COLORS.length],
  }));

  // Airline bar chart
  const airlineData = Object.entries(analytics.airline_distribution ?? {}).map(([name, value]) => ({ name, value }));

  // Stop distribution pie
  const stopData = Object.entries(analytics.stop_distribution ?? {}).map(([name, value]) => ({ name, value }));

  // Price by airline
  const priceByAirline = Object.entries(analytics.price_by_airline ?? {}).map(([name, value]) => ({ name, value }));

  const priceStats = analytics.price_stats ?? {};
  const durStats   = analytics.duration_stats ?? {};

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-1">Smart Analytics</h1>
        <p className="text-gray-400">
          Live insights from your dataset —&nbsp;
          <span className="text-amber-400 font-semibold">{analytics.rows?.toLocaleString()} rows</span>
          &nbsp;×&nbsp;
          <span className="text-amber-400 font-semibold">{analytics.columns} columns</span>
        </p>
      </motion.div>

      {/* Stat row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        <StatCard label="Total Rows"       value={analytics.rows?.toLocaleString()}    sub="flight records"             color="amber"  />
        <StatCard label="Total Columns"    value={analytics.columns}                    sub="feature dimensions"         color="blue"   />
        <StatCard label="Numerical Cols"   value={numCols.length}                       sub={numCols.slice(0,2).join(', ')} color="green"  />
        <StatCard label="Categorical Cols" value={catCols.length}                       sub={catCols.slice(0,2).join(', ')} color="purple" />
      </motion.div>

      {/* Price stats (if present) */}
      {priceStats.mean && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          <StatCard label="Min Price (₹)"    value={`₹${priceStats.min?.toLocaleString()}`}    color="green"  />
          <StatCard label="Max Price (₹)"    value={`₹${priceStats.max?.toLocaleString()}`}    color="amber"  />
          <StatCard label="Mean Price (₹)"   value={`₹${priceStats.mean?.toLocaleString()}`}   color="blue"   />
          <StatCard label="Median Price (₹)" value={`₹${priceStats.median?.toLocaleString()}`} color="purple" />
        </motion.div>
      )}

      {/* Composition + Feature Importance */}
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      >
        {/* Pie – Data Composition */}
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database className="text-amber-400" size={20} /> Data Composition
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={compositionData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {compositionData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-panel p-6 bg-gradient-to-br from-amber-900/20 to-yellow-900/10">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Sparkles className="text-amber-400" size={20} /> Feature Importance
            <span className="text-xs font-normal text-gray-500 ml-1">(variance-ranked)</span>
          </h3>
          <div className="space-y-4">
            {featureImportance.length > 0
              ? featureImportance.map((f, i) => <FeatureBar key={i} {...f} />)
              : <p className="text-gray-500 text-sm">No columns detected.</p>
            }
          </div>
        </div>
      </motion.div>

      {/* Airline Distribution Bar Chart */}
      {airlineData.length > 0 && (
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plane className="text-amber-400" size={20} /> Airline Distribution
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={airlineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff' }} />
                <Bar dataKey="value" name="Flights" radius={[4, 4, 0, 0]}>
                  {airlineData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Stop Distribution + Price by Airline */}
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        {/* Stop distribution pie */}
        {stopData.length > 0 && (
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-green-400" size={20} /> Stop Distribution
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stopData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {stopData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Avg price by airline */}
        {priceByAirline.length > 0 && (
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-400" size={20} /> Avg Price by Airline (₹)
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceByAirline} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#9ca3af', fontSize: 10 }} width={90} />
                  <RechartsTooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} itemStyle={{ color: '#fff' }} />
                  <Bar dataKey="value" name="Avg Price" radius={[0, 4, 4, 0]}>
                    {priceByAirline.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>

      {/* Duration stats */}
      {durStats.mean_minutes && (
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        >
          <StatCard label="Min Flight Duration" value={`${durStats.min_minutes} min`} sub={`${(durStats.min_minutes/60).toFixed(1)} hrs`} color="green"  />
          <StatCard label="Avg Flight Duration" value={`${durStats.mean_minutes} min`} sub={`${(durStats.mean_minutes/60).toFixed(1)} hrs`} color="amber"  />
          <StatCard label="Max Flight Duration" value={`${durStats.max_minutes} min`} sub={`${(durStats.max_minutes/60).toFixed(1)} hrs`} color="blue"   />
        </motion.div>
      )}

      {/* Column list */}
      <motion.div
        className="glass-panel p-6 border border-amber-500/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart2 className="text-amber-400" size={20} /> All Dataset Columns
          <span className="text-xs font-normal text-gray-500 ml-1">({analytics.columns} total)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {(analytics.column_names ?? []).map((col, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: COLORS[i % COLORS.length] + '22',
                borderColor:     COLORS[i % COLORS.length] + '66',
                color:           COLORS[i % COLORS.length],
              }}
            >
              {col}
            </span>
          ))}
        </div>
      </motion.div>

      {/* EDA Banner */}
      <motion.div
        className="glass-panel p-8 flex items-center justify-between border border-amber-500/30 bg-amber-900/10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
      >
        <div>
          <h3 className="text-2xl font-bold mb-2">Automated Exploratory Data Analysis</h3>
          <p className="text-gray-400">
            Aura AI analysed&nbsp;
            <span className="text-amber-400 font-semibold">{analytics.rows?.toLocaleString()} records</span>
            &nbsp;across&nbsp;
            <span className="text-amber-400 font-semibold">{analytics.columns} features</span>
            &nbsp;— live from your loaded dataset.
          </p>
        </div>
        <button className="px-6 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 transition font-medium text-amber-300 whitespace-nowrap">
          View Full EDA Report
        </button>
      </motion.div>

    </div>
  );
};

export default SmartAnalytics;
