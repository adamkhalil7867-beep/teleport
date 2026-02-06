
import React from 'react';

interface StatsDisplayProps {
  clickCount: number;
  elapsedTime: number;
  interval: number;
}

const StatCard: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-semibold text-cyan-400">
            {value}
            {unit && <span className="text-lg ml-1 text-gray-300">{unit}</span>}
        </p>
    </div>
);


export const StatsDisplay: React.FC<StatsDisplayProps> = ({ clickCount, elapsedTime, interval }) => {
  const formattedTime = (elapsedTime / 1000).toFixed(2);
  const clicksPerSecond = (elapsedTime > 0 ? clickCount / (elapsedTime / 1000) : 0).toFixed(2);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Live Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Clicks" value={clickCount} />
        <StatCard label="Elapsed Time" value={formattedTime} unit="s" />
        <StatCard label="Clicks / Sec" value={clicksPerSecond} />
        <StatCard label="Set Interval" value={interval} unit="ms" />
      </div>
    </div>
  );
};
