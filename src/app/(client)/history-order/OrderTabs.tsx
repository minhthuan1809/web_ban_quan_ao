"use client"
import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface OrderTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function OrderTabs({ tabs, activeTab, onTabChange }: OrderTabsProps) {
  return (
    <div className="flex overflow-x-auto mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-gray-200/60 dark:border-gray-600/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200
              ${isActive 
                ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-700/30'}
            `}
          >
            {tab.label}
            {typeof tab.count !== 'undefined' && (
              <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full border ${
                isActive 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-700' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
} 