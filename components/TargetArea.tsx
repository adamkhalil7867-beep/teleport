
import React, { useState } from 'react';
import type { ClickPoint } from '../types';
import { CrosshairIcon } from './Icons';

interface TargetAreaProps {
  clickPoints: ClickPoint[];
  monitoringPoint: { x: number; y: number } | null;
  isPicking: boolean;
}

const ColorChangingSquare: React.FC<{ initialColor: string; position: string }> = ({ initialColor, position }) => {
  const [color, setColor] = useState(initialColor);

  const changeColor = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering pixel selection when changing color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setColor(`rgb(${r}, ${g}, ${b})`);
  };

  return (
    <div
      onClick={changeColor}
      className={`absolute w-24 h-24 rounded-md shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${position}`}
      style={{ backgroundColor: color }}
    />
  );
}

export const TargetArea: React.FC<TargetAreaProps> = ({ clickPoints, monitoringPoint, isPicking }) => {
  return (
    <div
      id="target-area"
      className="w-full h-full bg-gray-800/60 rounded-xl border-2 border-dashed border-gray-700/70 relative overflow-hidden shadow-lg select-none"
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-50">
        <p className="text-gray-600 text-2xl font-semibold select-none">
          {isPicking ? 'Click anywhere to select a pixel' : 'Click Target Area'}
        </p>
      </div>

      <ColorChangingSquare initialColor="rgb(220, 38, 38)" position="top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
      <ColorChangingSquare initialColor="rgb(34, 197, 94)" position="top-3/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <ColorChangingSquare initialColor="rgb(59, 130, 246)" position="top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2" />
      
      {clickPoints.map(({ x, y, id }) => (
        <div
          key={id}
          className="absolute w-6 h-6 rounded-full bg-cyan-400/50 animate-ping pointer-events-none"
          style={{ 
            left: `${x}px`, 
            top: `${y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {monitoringPoint && (
        <div 
          className="absolute text-cyan-400 pointer-events-none"
          style={{
            left: `${monitoringPoint.x}px`,
            top: `${monitoringPoint.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CrosshairIcon className="w-8 h-8 animate-pulse" />
        </div>
      )}
    </div>
  );
};
