import React from 'react';
import { Train, Activity, ShieldAlert, Database, BarChart3, Layers, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, modelMetrics }) {
  const tabs = [
    { id: 'predictor', label: 'Safety Reform Predictor', icon: Activity },
    { id: 'analytics', label: 'Paper Analytics & Metrics', icon: BarChart3 },
    { id: 'alerts', label: 'Risk Alert & Decision Center', icon: ShieldAlert },
    { id: 'dataset', label: 'Historical Accident Logs', icon: Database },
    { id: 'benchmarks', label: 'Model Benchmarks', icon: Layers },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-slate-100 tracking-tight">RailShield AI</h1>
                <span className="bg-sky-500/10 text-sky-400 text-xs px-2 py-0.5 rounded-full border border-sky-500/20 font-medium">
                  XGBoost 98.33% Acc
                </span>
              </div>
              <p className="text-xs text-slate-400">Railway Safety Reform & Predictive Risk Analytics (JETIR 2025)</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">Model Engine: Ready</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Primary Algorithm</div>
              <div className="text-xs font-semibold text-slate-200">XGBoost (JETIR-2025)</div>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
