import React from 'react';
import type { TitledItem } from '../types';

interface PlanSectionProps {
  title: string;
  content: string | string[] | TitledItem[] | React.ReactNode;
}

const IconMap: { [key: string]: React.ReactNode } = {
  'Strategic Direction': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  'How We Will Win': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
  'Required Capabilities': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  'Leadership Approach': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21h6m-6-1a6 6 0 00-6 6" /></svg>,
  'Goals': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.7 9.3l.01-.01M16.3 9.3l.01-.01M12 20.055A4.502 4.502 0 017.5 15.555a4.5 4.5 0 019 0c0 .052 0 .104-.002.155a.5.5 0 01-.998.09A3.502 3.502 0 0012 12.555a3.5 3.5 0 00-3.5 3.5c0 .178.025.35.074.516a.5.5 0 01-.926.375A4.502 4.502 0 0112 20.055z" /></svg>,
  'Objectives': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  'Initiatives': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  'Key Tasks': <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
};

const PlanSection: React.FC<PlanSectionProps> = ({ title, content }) => {
  const renderContent = () => {
    if (typeof content === 'string') {
      return <p className="text-slate-600">{content}</p>;
    }
    if (Array.isArray(content) && content.length > 0) {
      if (typeof content[0] === 'string') {
        return (
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {(content as string[]).map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        );
      }
      if (typeof content[0] === 'object' && content[0] !== null && 'title' in content[0]) {
        return (
          <div className="space-y-3">
            {(content as TitledItem[]).map((item, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <h4 className="font-semibold text-slate-700">{item.title}</h4>
                <p className="text-slate-600 text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        );
      }
    }
    // FIX: An array (e.g. an empty one) is not a valid ReactNode.
    // If content is an array that fell through, render nothing. Otherwise, it's a valid ReactNode.
    if (Array.isArray(content)) {
      return null;
    }
    return content;
  };

  return (
    <div className="border-t border-slate-200 pt-4 plan-section-for-pdf">
      <div className="flex items-center mb-3">
        <span className="text-purple-600">{IconMap[title]}</span>
        <h3 className="text-lg font-semibold ml-3 text-slate-700">{title}</h3>
      </div>
      <div className="pl-9">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlanSection;