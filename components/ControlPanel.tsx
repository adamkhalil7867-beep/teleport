
import React from 'react';
import type { ClickerSettings } from '../types';
import { PlayIcon, PauseIcon, ResetIcon, CrosshairIcon } from './Icons';

interface ControlPanelProps {
  settings: ClickerSettings;
  setSettings: React.Dispatch<React.SetStateAction<ClickerSettings>>;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  isPicking: boolean;
  setIsPicking: React.Dispatch<React.SetStateAction<boolean>>;
  pickedColor: string | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  setSettings,
  isRunning,
  onStart,
  onStop,
  onReset,
  isPicking,
  setIsPicking,
  pickedColor,
}) => {
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'radio' ? value : Math.max(0, parseInt(value, 10)))
    }));
  };
  
  const canStart = settings.mode === 'interval' || (settings.mode === 'color' && settings.monitoringPoint);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Trigger Mode</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="mode" value="interval" checked={settings.mode === 'interval'} onChange={handleSettingsChange} disabled={isRunning} className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"/>
            <span className="ml-2 text-gray-200">Time Interval</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="mode" value="color" checked={settings.mode === 'color'} onChange={handleSettingsChange} disabled={isRunning} className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 focus:ring-cyan-500"/>
            <span className="ml-2 text-gray-200">Color Change</span>
          </label>
        </div>
      </div>
      
      {settings.mode === 'interval' ? (
        <div className="space-y-4 animate-fade-in">
          <label htmlFor="interval" className="block text-sm font-medium text-gray-300">
            Click Interval (ms)
          </label>
          <input
            type="number" id="interval" name="interval" value={settings.interval} onChange={handleSettingsChange} min="10" disabled={isRunning}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition disabled:opacity-50"
          />
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <button onClick={() => setIsPicking(!isPicking)} disabled={isRunning}
            className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50"
          >
            <CrosshairIcon className="h-5 w-5 mr-2" />
            {isPicking ? 'Cancel Picking' : 'Pick Pixel to Monitor'}
          </button>
          {settings.monitoringPoint && (
            <div className="text-sm bg-gray-700/50 p-3 rounded-md">
              <p>Monitoring at: <span className="font-mono text-cyan-400">({settings.monitoringPoint.x}, {settings.monitoringPoint.y})</span></p>
              <div className="flex items-center mt-1">
                <p>Initial Color:</p>
                <div className="w-4 h-4 rounded-full ml-2 border border-gray-500" style={{ backgroundColor: pickedColor ?? 'transparent' }}></div>
                <span className="font-mono text-cyan-400 ml-2">{pickedColor}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="clickLimit" className="block text-sm font-medium text-gray-300">
            Number of Clicks
          </label>
          <div className="flex items-center">
            <input
              type="checkbox" id="isLimited" name="isLimited" checked={settings.isLimited} onChange={handleSettingsChange} disabled={isRunning}
              className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 transition disabled:opacity-50"
            />
            <label htmlFor="isLimited" className="ml-2 block text-sm text-gray-400">
              Limit Clicks
            </label>
          </div>
        </div>
        <input
          type="number" id="clickLimit" name="clickLimit" value={settings.clickLimit} onChange={handleSettingsChange} min="1" disabled={!settings.isLimited || isRunning}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            disabled={!canStart}
            className="col-span-2 flex items-center justify-center w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
          >
            <PlayIcon className="h-5 w-5 mr-2" />
            Start Clicking
          </button>
        ) : (
          <button
            onClick={onStop}
            className="col-span-2 flex items-center justify-center w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
          >
            <PauseIcon className="h-5 w-5 mr-2" />
            Stop Clicking
          </button>
        )}
        <button
            onClick={onReset}
            disabled={isRunning}
            className="col-span-2 flex items-center justify-center w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
        >
            <ResetIcon className="h-4 w-4 mr-2" />
            Reset
        </button>
      </div>
    </div>
  );
};
