import React, { useRef, useState } from 'react';
import type { StrategicPlan, TitledItem } from '../types';
import { StrategyType } from '../types';
import PlanSection from './PlanSection';
import { planToPlainText, planToMarkdown } from '../utils/exportUtils';

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

interface PlanDisplayProps {
  plan: StrategicPlan;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan }) => {
  const planRef = useRef<HTMLDivElement>(null);
  const [copyText, setCopyText] = useState('Copy');

  const handleCopy = () => {
    const plainTextPlan = planToPlainText(plan);
    navigator.clipboard.writeText(plainTextPlan).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text.');
    });
  };

  const handleDownloadMarkdown = () => {
    const markdownPlan = planToMarkdown(plan);
    const blob = new Blob([markdownPlan], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quick-strategic-plan.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleEmail = () => {
    const plainTextPlan = planToPlainText(plan);
    const subject = encodeURIComponent("Your AI-Generated Quick Strategic Plan");
    const body = encodeURIComponent(plainTextPlan);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownloadPdf = async () => {
    const { jsPDF } = window.jspdf;
    const html2canvas = window.html2canvas;
    const elementToCapture = planRef.current;

    if (!elementToCapture || !jsPDF || !html2canvas) {
      console.error("PDF generation resources not available.");
      alert('Could not generate PDF. Please try refreshing the page.');
      return;
    }

    const buttons = elementToCapture.querySelector('.export-buttons') as HTMLElement;
    if (buttons) buttons.style.visibility = 'hidden';

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      const margin = 40;
      const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;
      let yPosition = margin;

      const headerElement = elementToCapture.querySelector('.plan-header') as HTMLElement;
      const sectionElements = elementToCapture.querySelectorAll('.plan-section-for-pdf');

      const elementsToRender = [headerElement, ...Array.from(sectionElements)];

      for (const element of elementsToRender) {
        if (!element) continue;

        const canvas = await html2canvas(element as HTMLElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          width: element.clientWidth,
          height: element.clientHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const ratio = pdfWidth / imgWidth;
        const scaledImgHeight = imgHeight * ratio;

        if (yPosition + scaledImgHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, yPosition, pdfWidth, scaledImgHeight);
        yPosition += scaledImgHeight + 10; // Add a small gap between sections
      }
  
      pdf.save('quick-strategic-plan.pdf');
    } catch (err) {
      console.error("Error generating PDF", err);
      alert('An error occurred while generating the PDF.');
    } finally {
      if (buttons) buttons.style.visibility = 'visible';
    }
  };

  return (
    <div ref={planRef} className="bg-white p-6 rounded-lg shadow-lg border border-slate-200">
      <div className="plan-header flex justify-between items-center border-b pb-3 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Your AI-Generated Quick Strategic Plan</h2>
        <div className="flex items-center space-x-1 sm:space-x-2 export-buttons">
            <button onClick={handleCopy} title="Copy to Clipboard" className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
              <span className="sr-only">Copy to Clipboard</span>
              {copyText === 'Copy' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
              )}
            </button>
            <button onClick={handleDownloadPdf} title="Download as PDF" className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                <span className="sr-only">Download as PDF</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </button>
            <button onClick={handleDownloadMarkdown} title="Download as Markdown" className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                <span className="sr-only">Download as Markdown</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
            <button onClick={handleEmail} title="Email Plan" className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500">
                <span className="sr-only">Email Plan</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>
        </div>
      </div>
      <div className="space-y-6 plan-sections-container">
        <PlanSection title="Strategic Direction" content={plan.direction} />
        <PlanSection title="How We Will Win" content={
          <div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${plan.howToWin.strategy === StrategyType.PRICE ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'}`}>
              {plan.howToWin.strategy === StrategyType.PRICE ? 'Price Leadership' : 'Differentiation'}
            </span>
            <p className="mt-2 text-slate-600">{plan.howToWin.justification}</p>
          </div>
        } />
        <PlanSection title="Required Capabilities" content={plan.capabilities} />
        <PlanSection title="Leadership Approach" content={plan.leadership} />
        <PlanSection title="Goals" content={plan.goals as TitledItem[]} />
        <PlanSection title="Objectives" content={plan.objectives as TitledItem[]} />
        <PlanSection title="Initiatives" content={plan.initiatives as TitledItem[]} />
        <PlanSection title="Key Tasks" content={plan.tasks as TitledItem[]} />
      </div>
    </div>
  );
};

export default PlanDisplay;