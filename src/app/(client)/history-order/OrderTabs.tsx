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
    <div className="flex overflow-x-auto mb-6 bg-content1 backdrop-blur-sm rounded-2xl shadow-lg border border-divider">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center px-6 py-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200
              ${isActive 
                ? 'border-primary text-primary bg-primary/10' 
                : 'border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/30 hover:bg-foreground/10'}
            `}
          >
            {tab.label}
            {typeof tab.count !== 'undefined' && (
              <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full border ${
                isActive 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-default-100 text-foreground/60 border-divider'
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