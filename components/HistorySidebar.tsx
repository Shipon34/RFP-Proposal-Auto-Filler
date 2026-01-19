import React from 'react';
import { ProposalResponse } from '../types';

interface HistorySidebarProps {
  history: ProposalResponse[];
  onSelect: (item: ProposalResponse) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div className="text-slate-500 text-sm italic">
        No recent drafts.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {history.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onSelect(item)}
            className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all group"
          >
            <div className="font-medium text-slate-300 text-sm truncate group-hover:text-blue-400">
              {item.request.sectionTopic}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex justify-between">
              <span className="truncate max-w-[120px]">{item.request.userNotes.substring(0, 20)}...</span>
              <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
};