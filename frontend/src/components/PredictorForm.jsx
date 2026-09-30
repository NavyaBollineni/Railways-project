import React, { useState } from 'react';
import { Play, AlertTriangle, ShieldCheck, Cpu, ArrowRight, Gauge, CheckCircle2 } from 'lucide-react';

export default function PredictorForm({ onPredictionComplete }) {
  const [formData, setFormData] = useState({
    accident_cause: 'Signal Failure',
    accident_type: 'Derailment',
    rail_zone: 'North Zone',
    weather_condition: 'Rain',
    rescue_response_time_min: 45,
    track_stiffness_index: 0.35,
    speed_mph: 85,
    equipment_age_years: 14,
    human_error_flag: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const causes = ['Signal Failure', 'Track Stiffness Loss', 'Human Error', 'Equipment Malfunction', 'Weather/Crossing Hazard'];
  const types = ['Derailment', 'Collision', 'Crossing Incident', 'Fall/Slip/Trip', 'Station Anomaly'];
  const zones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central Zone'];
  const weathers = ['Clear', 'Rain', 'Fog', 'Storm', 'Heatwave'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Prediction API returned an error');
      }

      const data = await response.json();
      setResult(data);
      if (onPredictionComplete) onPredictionComplete();
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Form Section */}
      <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-700/60">
          <div className="p-2.5 bg-sky-500/10 rounded-xl border border-sky-500/20">
            <Cpu className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Accident Parameter Inputs</h2>
            <p className="text-xs text-slate-400">Input incident factors to execute XGBoost inference</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Accident Cause</label>
              <select
                name="accident_cause"
                value={formData.accident_cause}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {causes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Accident Type</label>
              <select
                name="accident_type"
                value={formData.accident_type}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rail Zone / Location</label>
              <select
                name="rail_zone"
                value={formData.rail_zone}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Weather Condition</label>
              <select
                name="weather_condition"
                value={formData.weather_condition}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                {weathers.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Rescue Response Time</span>
                <span className="text-sky-400 font-mono">{formData.rescue_response_time_min} mins</span>
              </div>
              <input
                type="range"
                name="rescue_response_time_min"
                min="10"
                max="180"
                value={formData.rescue_response_time_min}
                onChange={handleChange}
                className="w-full accent-sky-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Track Stiffness Index</span>
                <span className="text-sky-400 font-mono">{formData.track_stiffness_index}</span>
              </div>
              <input
                type="range"
                name="track_stiffness_index"
                min="0.10"
                max="1.00"
                step="0.05"
                value={formData.track_stiffness_index}
                onChange={handleChange}
                className="w-full accent-sky-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Train Speed (mph)</span>
                <span className="text-sky-400 font-mono">{formData.speed_mph} mph</span>
              </div>
              <input
                type="range"
                name="speed_mph"
                min="10"
                max="130"
                value={formData.speed_mph}
                onChange={handleChange}
                className="w-full accent-sky-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-300">Equipment Age (Years)</span>
                <span className="text-sky-400 font-mono">{formData.equipment_age_years} yrs</span>
              </div>
              <input
                type="range"
                name="equipment_age_years"
                min="1"
                max="30"
                value={formData.equipment_age_years}
                onChange={handleChange}
                className="w-full accent-sky-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Human Error Involved?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, human_error_flag: 0 }))}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  formData.human_error_flag === 0
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                No (0)
              </button>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, human_error_flag: 1 }))}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  formData.human_error_flag === 1
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Yes (1)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Evaluating XGBoost Model...</span>
              </span>
            ) : (
              <>
                <span>Predict Recommended Safety Reform</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>

      {/* Output / Results Section */}
      <div className="lg:col-span-6 flex flex-col space-y-6">
        
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center space-x-3 text-rose-300">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <div className="text-xs">{error}</div>
          </div>
        )}

        {!result && !error && (
          <div className="bg-slate-800/40 border border-slate-700/40 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full text-slate-400">
            <Gauge className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">Ready for Inference</h3>
            <p className="text-xs max-w-xs mt-1 text-slate-500">
              Select parameters on the left and click predict to run the XGBoost machine learning model.
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            
            {/* Primary Prediction Box */}
            <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl"></div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Recommended Safety Reform</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getRiskBadgeColor(result.risk_level)}`}>
                  {result.risk_level} RISK ({result.risk_score}/100)
                </span>
              </div>

              <div className="text-xl font-black text-sky-300 mb-2">
                {result.predicted_reform}
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700/60">
                <div>
                  <span className="block text-slate-500">Model Confidence</span>
                  <span className="text-sm font-bold text-emerald-400">{result.confidence_score}%</span>
                </div>
                <div>
                  <span className="block text-slate-500">Algorithm</span>
                  <span className="text-sm font-bold text-slate-200">XGBoost Ensemble</span>
                </div>
              </div>
            </div>

            {/* Probability Breakdown */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Reform Probability Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(result.probabilities).map(([reform, prob]) => (
                  <div key={reform}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-medium truncate max-w-xs">{reform}</span>
                      <span className="font-mono text-sky-400 font-bold">{prob}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prob}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Directives */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Automated Policy Directives</span>
              </h3>
              <ul className="space-y-2">
                {result.safety_policy_directives.map((dir, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{dir}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
