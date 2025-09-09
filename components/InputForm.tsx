
import React from 'react';

interface InputFormProps {
  mission: string;
  setMission: (value: string) => void;
  vision: string;
  setVision: (value:string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ mission, setMission, vision, setVision, onSubmit, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-700">1. Define Your Foundation</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-slate-600 mb-1">
            Mission Statement
          </label>
          <textarea
            id="mission"
            rows={3}
            className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            placeholder="What is your organization's core purpose?"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-slate-600 mb-1">
            Vision Statement
          </label>
          <textarea
            id="vision"
            rows={3}
            className="w-full px-3 py-2 text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            placeholder="What future do you want to create?"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="text-right">
          <button
            onClick={onSubmit}
            disabled={isLoading || !mission || !vision}
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Quick Strategic Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;