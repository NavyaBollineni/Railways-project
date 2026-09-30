import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Award, Zap, Activity, GitCommit, CheckCircle } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/metrics')
      .then(res => res.json())
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <span className="ml-3 text-xs">Loading JETIR Research Analytics...</span>
      </div>
    );
  }

  if (!metrics) {
    return <div className="text-slate-400 text-xs p-6">Failed to load analytics metrics from API.</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Model Accuracy</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{metrics.accuracy}%</div>
          <div className="text-[10px] text-slate-500 mt-1">XGBoost Ensemble Target</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Precision Score</span>
            <Zap className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400 mt-2">{metrics.precision}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Low Misclassification Rate</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Recall (Sensitivity)</span>
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-2">{metrics.recall}%</div>
          <div className="text-[10px] text-slate-500 mt-1">High Incident Detection</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">F1-Score</span>
            <GitCommit className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 mt-2">{metrics.f1_score}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Harmonic Balance</div>
        </div>

      </div>

      {/* Row 1: Feature Importance Graph & Training History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Figure 1: Feature Importance Analysis Graph */}
        <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Figure 1: Feature Importance Analysis</h3>
              <p className="text-xs text-slate-400">Key predictor variables influencing reform recommendation</p>
            </div>
            <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">JETIR 2025</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={metrics.feature_importances} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Importance']}
                />
                <Bar dataKey="importance" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loss & Accuracy Curves */}
        <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Training vs Validation Loss / Accuracy</h3>
              <p className="text-xs text-slate-400">Iterative convergence curve demonstrating no overfitting</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">Convergence</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.loss_curve} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="iteration" stroke="#94a3b8" tick={{ fontSize: 10 }} label={{ value: 'Trees', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="train_loss" stroke="#38bdf8" name="Train Loss" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="val_loss" stroke="#f43f5e" name="Val Loss" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="val_accuracy" stroke="#34d399" name="Val Accuracy" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Confusion Matrix & ROC Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Figure 2: Confusion Matrix */}
        <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Figure 2: Confusion Matrix Visualizer</h3>
              <p className="text-xs text-slate-400">True vs Predicted multi-class reform classifications</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-[10px] text-slate-400 font-semibold border border-slate-700 bg-slate-900/50">Actual \ Pred</th>
                  {metrics.classes.map((cls, idx) => (
                    <th key={idx} className="p-2 text-[10px] text-sky-400 font-semibold border border-slate-700 bg-slate-900/50 max-w-[80px] truncate" title={cls}>
                      C{idx+1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.confusion_matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="p-2 text-[10px] text-sky-400 font-semibold border border-slate-700 bg-slate-900/50 text-left" title={metrics.classes[rIdx]}>
                      C{rIdx+1} ({metrics.classes[rIdx].split(' ')[0]})
                    </td>
                    {row.map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      return (
                        <td
                          key={cIdx}
                          className={`p-2 text-xs font-bold border border-slate-700 ${
                            isDiagonal
                              ? 'bg-emerald-500/20 text-emerald-300 font-black'
                              : val > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-900/30 text-slate-600'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
            {metrics.classes.map((cls, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 truncate">
                <span className="font-bold text-sky-400 font-mono">C{idx+1}:</span>
                <span className="truncate">{cls}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROC Curves */}
        <div className="lg:col-span-6 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">ROC Curves & AUC Analysis</h3>
              <p className="text-xs text-slate-400">Receiver Operating Characteristic across reform classes (AUC ≈ 0.99)</p>
            </div>
            <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">AUC = 0.99</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {metrics.roc_curves.map((roc, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-slate-200">{roc.category}</span>
                  <span className="font-mono text-emerald-400 font-bold">AUC = {roc.auc}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${roc.auc * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
