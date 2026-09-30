import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Layers, Trophy, CheckCircle, Cpu } from 'lucide-react';

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Failed to load metrics", err));
  }, []);

  if (!metrics) {
    return <div className="text-slate-400 text-xs p-6">Loading model benchmarks...</div>;
  }

  const benchmarkData = Object.entries(metrics.benchmark_accuracies).map(([model, acc]) => ({
    model,
    accuracy: acc,
  }));

  const colors = ['#0284c7', '#34d399', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8">
      
      {/* Trophy / Best Model Banner */}
      <div className="bg-gradient-to-r from-sky-900/50 to-indigo-900/50 border border-sky-500/30 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-sky-500/20 rounded-xl border border-sky-400/30 text-sky-400">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">Optimal Model: XGBoost Classifier</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">98.33% Accuracy</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              XGBoost outperforms Random Forest, Decision Trees, and Support Vector Machines (SVM) due to gradient-boosted decision tree regularization, handling of non-linear track interactions, and resistance to overfitting.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Chart & Feature Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Accuracy Comparison Bar Chart */}
        <div className="lg:col-span-7 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-100 mb-2">Algorithm Accuracy Benchmarks</h3>
          <p className="text-xs text-slate-400 mb-6">Evaluated on 1,500 historical railway incident records</p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="model" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {benchmarkData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Algorithm Capability Matrix</h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl">
              <div className="flex justify-between font-bold text-sky-300">
                <span>XGBoost (Proposed)</span>
                <span>98.33% Acc</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">High gradient boosting speed, feature regularization, optimal for tabular railway data.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <div className="flex justify-between font-bold text-emerald-400">
                <span>Random Forest</span>
                <span>{metrics.benchmark_accuracies['Random Forest']}% Acc</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Bagging ensemble, resistant to noise but slightly lower accuracy than boosting.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <div className="flex justify-between font-bold text-amber-400">
                <span>Decision Tree</span>
                <span>{metrics.benchmark_accuracies['Decision Tree']}% Acc</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Single tree classifier, susceptible to high variance and over-simplification.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <div className="flex justify-between font-bold text-purple-400">
                <span>Support Vector Machine (SVM)</span>
                <span>{metrics.benchmark_accuracies['SVM']}% Acc</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Hyperplane classification, requires intensive scaling, slower on continuous non-linear tabular features.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
