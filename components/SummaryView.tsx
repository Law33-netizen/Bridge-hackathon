import React, { useState } from 'react';
import { Summary } from '../types';
import { CheckCircle2, Calendar, DollarSign, Info, Square, CheckSquare, AlertCircle } from 'lucide-react';

interface SummaryViewProps {
  summary: Summary;
  onActionHover?: (index: number | null) => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onActionHover }) => {
  const [completedActions, setCompletedActions] = useState<Record<number, boolean>>({});

  const toggleAction = (index: number) => {
    setCompletedActions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const cleanText = (text: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = text;
    return temp.textContent || temp.innerText || "";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="bg-blue-600 px-6 py-4 shrink-0">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="h-6 w-6" />
          Document Summary
        </h2>
        <p className="text-blue-100 mt-1">
          Simple explanation and key takeaways
        </p>
      </div>
      
      <div className="p-4 grid gap-4 overflow-y-auto flex-1">
        {/* Purpose Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide text-xs">
            What is this document?
          </h3>
          <p className="text-gray-800 text-base leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
            {summary.purpose}
          </p>
        </div>

        {/* Stacked Layout for Actions, Deadlines, Costs */}
        <div className="grid grid-cols-1 gap-4">
          {/* Actions Section */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <h3 className="text-orange-800 font-bold flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5" />
              Things to Do
            </h3>
            {summary.actions.length === 0 || (summary.actions.length === 1 && summary.actions[0].toLowerCase().includes('none')) ? (
               <p className="text-gray-500 italic text-sm">No specific actions found.</p>
            ) : (
              <ul className="space-y-2">
                {summary.actions.map((action, idx) => {
                  const isCompleted = !!completedActions[idx];
                  return (
                    <li 
                      key={idx} 
                      className={`flex items-start gap-3 p-2 rounded-md transition-colors cursor-pointer group ${isCompleted ? 'bg-orange-100/50' : 'hover:bg-white hover:shadow-sm'}`}
                      onMouseEnter={() => onActionHover && onActionHover(idx)}
                      onMouseLeave={() => onActionHover && onActionHover(null)}
                      onClick={() => toggleAction(idx)}
                    >
                      <button 
                        className="mt-0.5 text-orange-600 hover:text-orange-700 shrink-0 transition-colors focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAction(idx);
                        }}
                      >
                        {isCompleted ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <span className={`text-sm font-medium transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {cleanText(action)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Due Dates Section */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="text-purple-800 font-bold flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5" />
              Deadlines
            </h3>
             {summary.due_dates.length === 0 || (summary.due_dates.length === 1 && summary.due_dates[0].toLowerCase().includes('no explicit')) ? (
               <p className="text-gray-500 italic text-sm">No specific deadlines.</p>
            ) : (
              <ul className="space-y-2">
                {summary.due_dates.map((date, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-800 text-sm font-medium">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                    <span>{date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Costs Section */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="text-green-800 font-bold flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5" />
              Costs & Fees
            </h3>
            {summary.costs.length === 0 || (summary.costs.length === 1 && summary.costs[0].toLowerCase().includes('no costs')) ? (
               <p className="text-gray-500 italic text-sm">No costs mentioned.</p>
            ) : (
              <ul className="space-y-2">
                {summary.costs.map((cost, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-800 text-sm font-medium">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                    <span>{cost}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Important Info Section */}
          {summary.important_info && summary.important_info.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5" />
                Important Notes
              </h3>
              <ul className="space-y-2">
                {summary.important_info.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-800 text-sm font-medium">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryView;