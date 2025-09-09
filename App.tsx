
import React, { useState, useCallback } from 'react';
import type { StrategicPlan } from './types';
import { generateStrategicPlan } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PlanDisplay from './components/PlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Welcome from './components/Welcome';

const App: React.FC = () => {
  const [mission, setMission] = useState<string>('');
  const [vision, setVision] = useState<string>('');
  const [strategicPlan, setStrategicPlan] = useState<StrategicPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    if (!mission || !vision) {
      setError('Please provide both a mission and a vision.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStrategicPlan(null);

    try {
      const plan = await generateStrategicPlan(mission, vision);
      setStrategicPlan(plan);
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [mission, vision]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <InputForm
            mission={mission}
            setMission={setMission}
            vision={vision}
            setVision={setVision}
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
          />

          <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {strategicPlan && <PlanDisplay plan={strategicPlan} />}
            {!isLoading && !strategicPlan && !error && <Welcome />}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by <a href="https://maxwellriskgroup.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Maxwell Risk Group</a> and AI.</p>
      </footer>
    </div>
  );
};

export default App;