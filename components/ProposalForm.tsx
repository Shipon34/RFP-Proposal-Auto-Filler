import React, { useState } from 'react';
import { ProposalRequest } from '../types';

interface ProposalFormProps {
  onGenerate: (request: ProposalRequest) => void;
  isLoading: boolean;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({ onGenerate, isLoading }) => {
  const [sectionTopic, setSectionTopic] = useState('');
  const [userNotes, setUserNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTopic.trim() || !userNotes.trim()) return;
    onGenerate({ sectionTopic, userNotes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">
          Proposal Section / Topic
        </label>
        <input
          id="topic"
          type="text"
          value={sectionTopic}
          onChange={(e) => setSectionTopic(e.target.value)}
          placeholder="e.g., Executive Summary, Methodology, Pricing Strategy"
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
          Key Notes & Requirements
        </label>
        <div className="relative">
          <textarea
            id="notes"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Paste raw notes here. E.g., 'Client needs 20% growth, worried about timeline, tech stack is React...'"
            className="w-full h-48 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            required
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">
            AI will format & polish
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !sectionTopic || !userNotes}
        className={`
          w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg 
          flex items-center justify-center gap-2 transition-all transform
          ${isLoading 
            ? 'bg-slate-700 cursor-not-allowed opacity-70' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Proposal...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
            Generate Content
          </>
        )}
      </button>
    </form>
  );
};