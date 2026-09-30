import React, { useEffect, useState } from 'react';
import { Database, Search, RefreshCw, Filter } from 'lucide-react';

export default function DatasetViewer() {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState('ALL');

  const fetchAccidents = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/accidents?limit=100')
      .then(res => res.json())
      .then(data => {
        setAccidents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load accidents", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAccidents();
  }, []);

  const filteredData = accidents.filter(item => {
    const matchesSearch = item.accident_cause.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.predicted_reform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.rail_zone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = filterZone === 'ALL' || item.rail_zone === filterZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20 text-sky-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Historical Railway Accident Records</h2>
            <p className="text-xs text-slate-400">SQLite Database Log ({accidents.length} total logged incidents)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cause, reform, zone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Zone Filter */}
          <select
            value={filterZone}
            onChange={(e) => setFilterZone(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Zones</option>
            <option value="North Zone">North Zone</option>
            <option value="South Zone">South Zone</option>
            <option value="East Zone">East Zone</option>
            <option value="West Zone">West Zone</option>
            <option value="Central Zone">Central Zone</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchAccidents}
            className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Records Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading database records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-700/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="p-3">ID</th>
                  <th className="p-3">Rail Zone</th>
                  <th className="p-3">Cause</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Weather</th>
                  <th className="p-3">Speed</th>
                  <th className="p-3">Track Stiffness</th>
                  <th className="p-3">Response Time</th>
                  <th className="p-3">Predicted Reform</th>
                  <th className="p-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-300">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-6 text-center text-slate-500">No matching accident records found.</td>
                  </tr>
                ) : (
                  filteredData.map(row => (
                    <tr key={row.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-3 font-mono text-slate-400">#{row.id}</td>
                      <td className="p-3 font-medium text-slate-200">{row.rail_zone}</td>
                      <td className="p-3 text-sky-400 font-medium">{row.accident_cause}</td>
                      <td className="p-3">{row.accident_type}</td>
                      <td className="p-3">{row.weather_condition}</td>
                      <td className="p-3 font-mono">{row.speed_mph} mph</td>
                      <td className="p-3 font-mono">{row.track_stiffness_index}</td>
                      <td className="p-3 font-mono">{row.rescue_response_time_min} min</td>
                      <td className="p-3 font-bold text-slate-100">{row.predicted_reform}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.risk_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          row.risk_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          row.risk_level === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {row.risk_level}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
