"use client"

import React from 'react';
import { StagewiseToolbar } from '@stagewise/toolbar-react';

interface StagewiseWrapperProps {
  config?: any; // Sử dụng any để tránh lỗi type tạm thời
}

export default function StagewiseWrapper({ config = { plugins: [] } }: StagewiseWrapperProps) {
  // Chỉ render ở development mode và client-side
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <StagewiseToolbar config={config} />;
} 