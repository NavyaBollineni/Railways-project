import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2, ArrowUpRight, Radio, Sliders } from 'lucide-react';

export default function RiskAlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load alerts", err);
        setLoading(false);
      });
  }, []);

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Info Banner */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Real-Time Risk & Decision Support Center</h2>
            <p className="text-xs text-slate-400">Continuous anomaly monitoring & proactive policy intervention guidelines</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-200">Live Telemetry Feed Active</span>
        </div>
      </div>

      {/* Active Safety Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Active High-Risk Rail Sector Alerts</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{alerts.length} Active Triggers</span>
          </div>

          {loading ? (
            <div className="text-slate-400 text-xs p-6">Fetching live telemetry...</div>
          ) : (
            alerts.map(alert => (
              <div
                key={alert.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-400 font-semibold">{alert.id}</span>
                    <span className="text-xs text-slate-300 font-bold">• {alert.rail_zone}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1">{alert.alert_title}</h4>
                <p className="text-xs text-slate-400 mb-3">{alert.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center space-x-1.5 text-sky-400 font-medium">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Reform: {alert.recommended_reform}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Proactive Policy Framework */}
        <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 h-fit">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Policy Reform Execution Guidelines</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <span className="font-bold text-sky-400 block mb-1">1. Shift from Reactive to Preventive</span>
              <p className="text-slate-400">Replaces manual accident review with automated XGBoost feature prediction.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <span className="font-bold text-sky-400 block mb-1">2. Digital Twin Anomaly Sensor Integration</span>
              <p className="text-slate-400">Stream accelerometer and track stiffness index telemetry directly to backend ML models.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <span className="font-bold text-sky-400 block mb-1">3. Automated Emergency Rescue Optimization</span>
              <p className="text-slate-400">Reduce rescue arrival latency from 60+ mins down to 30 mins via dedicated zone hubs.</p>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl">
              <span className="font-bold text-sky-400 block mb-1">4. Continuous Model Retraining</span>
              <p className="text-slate-400">Self-adaptive feedback loops ensure 98%+ prediction precision over time.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
