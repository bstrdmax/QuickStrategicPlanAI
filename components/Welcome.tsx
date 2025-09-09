
import React from 'react';

const Welcome: React.FC = () => {
    return (
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
            <div className="flex justify-center items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome to Quick Strategic Plan AI</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
                Turn your vision into a concrete plan. Simply provide your organization's mission and vision statements above, and our AI will generate a comprehensive strategic framework to guide your success.
            </p>
        </div>
    );
};

export default Welcome;