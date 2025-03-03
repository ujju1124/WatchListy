import React from 'react';
import { cn } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <div className="inline-flex bg-gray-800 rounded-xl p-1 border border-gray-700 w-full sm:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none",
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};