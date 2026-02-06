
import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { StatsDisplay } from './components/StatsDisplay';
import { TargetArea } from './components/TargetArea';
import { useAutoClicker } from './hooks/useAutoClicker';
import type { ClickerSettings, ClickPoint } from './types';

function App() {
  const [settings, setSettings] = useState<ClickerSettings>({
    interval: 1000,
    clickLimit: 10,
    isLimited: true,
    mode: 'interval',
    monitoringPoint: null,
  });
  const [isPicking, setIsPicking] = useState(false);
  const [pickedColor, setPickedColor] = useState<string | null>(null);

  const [clickPoints, setClickPoints] = useState<ClickPoint[]>([]);

  const handleNewClick = (x: number, y: number) => {
    const newPoint: ClickPoint = { x, y, id: Date.now() + Math.random() };
    setClickPoints(prev => [...prev, newPoint]);
    setTimeout(() => {
      setClickPoints(current => current.filter(p => p.id !== newPoint.id));
    }, 1000); // Animation duration
  };

  const {
    isRunning,
    clickCount,
    elapsedTime,
    start,
    stop,
    reset,
  } = useAutoClicker(settings, handleNewClick);

  const handleReset = () => {
    reset();
    setClickPoints([]);
    setSettings(prev => ({ ...prev, monitoringPoint: null }));
    setPickedColor(null);
  };

  const handlePixelSelect = (e: React.MouseEvent) => {
    if (!isPicking) return;
    const point = { x: e.clientX, y: e.clientY };
    const element = document.elementFromPoint(point.x, point.y);
    const color = element ? window.getComputedStyle(element).backgroundColor : 'transparent';
    
    setSettings(prev => ({ ...prev, monitoringPoint: point }));
    setPickedColor(color);
    setIsPicking(false);
  };

  return (
    <div 
      className="flex flex-col md:flex-row h-screen bg-gray-900 font-sans"
      style={{ cursor: isPicking ? 'crosshair' : 'default' }}
      onClick={handlePixelSelect}
    >
      <div className="w-full md:w-80 lg:w-96 bg-gray-800/50 border-r border-gray-700/50 p-6 flex flex-col space-y-8 overflow-y-auto">
        <header>
          <h1 className="text-3xl font-bold text-cyan-400">Auto Clicker</h1>
          <p className="text-gray-400 mt-1">Desktop Click Simulator</p>
        </header>

        <ControlPanel 
          settings={settings}
          setSettings={setSettings}
          isRunning={isRunning}
          onStart={start}
          onStop={stop}
          onReset={handleReset}
          isPicking={isPicking}
          setIsPicking={setIsPicking}
          pickedColor={pickedColor}
        />
        
        <StatsDisplay 
          clickCount={clickCount}
          elapsedTime={elapsedTime}
          interval={settings.interval}
        />
        
        <footer className="mt-auto pt-4 text-center text-gray-500 text-xs">
          <p>&copy; 2024. For demonstration purposes only.</p>
          <p>This app simulates clicks within this page and does not control your OS cursor.</p>
        </footer>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <TargetArea 
          clickPoints={clickPoints} 
          monitoringPoint={settings.monitoringPoint}
          isPicking={isPicking}
        />
      </main>
    </div>
  );
}

export default App;
