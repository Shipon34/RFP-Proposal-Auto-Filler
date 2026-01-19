import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProposalForm } from './components/ProposalForm';
import { ProposalResult } from './components/ProposalResult';
import { generateProposalSection } from './services/geminiService';
import { ProposalRequest, ProposalResponse, GroundingSource } from './types';
import { HistorySidebar } from './components/HistorySidebar';

// Helper to categorize and format errors
const analyzeError = (error: unknown): { title: string; message: string } => {
  const msg = error instanceof Error ? error.message : String(error);
  const lowerMsg = msg.toLowerCase();

  // Authentication Issues
  if (lowerMsg.includes('api key') || lowerMsg.includes('403') || lowerMsg.includes('unauthenticated')) {
    return {
      title: "Authentication Failed",
      message: "Access denied. Please ensure your API_KEY is correctly configured and valid."
    };
  }

  // Rate Limiting
  if (lowerMsg.includes('429') || lowerMsg.includes('resource exhausted') || lowerMsg.includes('quota')) {
    return {
      title: "Usage Limit Exceeded",
      message: "You have reached the API rate limit. Please wait a moment before trying again."
    };
  }

  // Server Issues
  if (lowerMsg.includes('503') || lowerMsg.includes('unavailable') || lowerMsg.includes('overloaded')) {
    return {
      title: "Service Unavailable",
      message: "The AI service is currently experiencing high traffic. Please try again in a few seconds."
    };
  }

  // Safety & Content Issues
  if (lowerMsg.includes('safety') || lowerMsg.includes('blocked') || lowerMsg.includes('no content generated')) {
    return {
      title: "Generation Blocked",
      message: "The model could not generate a response, likely due to safety filters. Please refine your input notes and try again."
    };
  }
  
  // Network Issues
  if (lowerMsg.includes('fetch') || lowerMsg.includes('network') || lowerMsg.includes('failed to fetch')) {
    return {
      title: "Connection Error",
      message: "Could not connect to the API. Please check your internet connection."
    };
  }

  // Default / Unknown Errors
  return {
    title: "Generation Error",
    message: msg || "An unexpected error occurred while processing your request."
  };
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [currentSources, setCurrentSources] = useState<GroundingSource[]>([]);
  // Store structured error object instead of simple string
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [history, setHistory] = useState<ProposalResponse[]>([]);

  const handleGenerate = async (request: ProposalRequest) => {
    setIsLoading(true);
    setError(null);
    setCurrentResponse(null);
    setCurrentSources([]);

    try {
      const { text, sources } = await generateProposalSection(request);
      setCurrentResponse(text);
      setCurrentSources(sources);
      
      const newEntry: ProposalResponse = {
        id: Date.now().toString(),
        request,
        response: text,
        sources: sources,
        timestamp: new Date(),
      };
      
      setHistory(prev => [newEntry, ...prev]);
    } catch (err) {
      console.error("Full error object:", err);
      setError(analyzeError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: ProposalResponse) => {
    setCurrentResponse(item.response);
    setCurrentSources(item.sources || []);
    setError(null); // Clear errors when selecting history
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      {/* Sidebar for History */}
      <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-900 flex-shrink-0 md:h-screen sticky top-0 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Recent Drafts
          </h2>
          <HistorySidebar history={history} onSelect={handleSelectHistory} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <Header />
        
        <div className="flex-1 p-6 md:p-12 space-y-12">
          <section className="space-y-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                Proposal Genius
              </h1>
              <p className="text-lg text-slate-400">
                Generate high-conversion proposal sections for <span className="text-blue-400 font-semibold">Aideal Agency</span> clients. Focus on ROI, speed, and efficiency.
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
                <ProposalForm onGenerate={handleGenerate} isLoading={isLoading} />
              </div>
              
              {/* Mobile History View (only visible on small screens) */}
              <div className="md:hidden">
                 <h3 className="text-lg font-semibold text-slate-300 mb-4">Recent Drafts</h3>
                 <HistorySidebar history={history} onSelect={handleSelectHistory} />
              </div>
            </div>

            {/* Output Section */}
            <div className="lg:sticky lg:top-12 transition-all duration-500">
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-start gap-3 animate-fadeIn">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0 text-red-400 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-100">{error.title}</p>
                    <p className="text-sm opacity-90 mt-1 text-red-200/80">{error.message}</p>
                  </div>
                </div>
              )}
              
              <ProposalResult 
                content={currentResponse} 
                sources={currentSources}
                isLoading={isLoading} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}