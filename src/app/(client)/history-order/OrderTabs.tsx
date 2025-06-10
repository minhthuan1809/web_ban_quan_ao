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
    <div className="flex overflow-x-auto mb-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
              ${isActive 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'}
            `}
          >
            {tab.label}
            {typeof tab.count !== 'undefined' && (
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
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