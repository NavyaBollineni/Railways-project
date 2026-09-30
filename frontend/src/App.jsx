import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PredictorForm from './components/PredictorForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RiskAlertCenter from './components/RiskAlertCenter';
import DatasetViewer from './components/DatasetViewer';
import ModelComparison from './components/ModelComparison';
import { BookOpen, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab Views */}
        {activeTab === 'predictor' && <PredictorForm onPredictionComplete={() => {}} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'alerts' && <RiskAlertCenter />}
        {activeTab === 'dataset' && <DatasetViewer />}
        {activeTab === 'benchmarks' && <ModelComparison />}

      </main>

      {/* Footer & Paper Citation */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Journal of Emerging Technologies and Innovative Research (JETIR), Vol. 12, Issue 4, April 2025</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500">ISSN-2349-5162</span>
            <span className="text-slate-500">•</span>
            <span className="text-sky-400 font-semibold">XGBoost Safety Reform System v1.0</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
