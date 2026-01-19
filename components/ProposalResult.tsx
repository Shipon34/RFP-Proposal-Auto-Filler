import React, { useState, useEffect } from 'react';
import { GroundingSource } from '../types';

interface ProposalResultProps {
  content: string | null;
  sources?: GroundingSource[];
  isLoading: boolean;
}

export const ProposalResult: React.FC<ProposalResultProps> = ({ content, sources, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
    }
  };

  if (!content && !isLoading) {
    return (
      <div className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/30 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Ready to Write</h3>
        <p className="max-w-xs mx-auto">Enter your notes on the left to generate a professional proposal section drafted by AI.</p>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100 shadow-2xl shadow-blue-900/20'}`}>
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Generated Draft
        </h3>
        
        {content && (
          <button
            onClick={handleCopy}
            className="text-xs font-medium px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-green-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
                </svg>
                Copy Text
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="bg-slate-900 p-8 min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="space-y-2 mt-8">
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-300">
            {content}
          </div>
        )}

        {sources && sources.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
              Sources & Citations
            </h4>
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="text-sm">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-start gap-2"
                  >
                    <span className="text-slate-600 mt-0.5">•</span>
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};