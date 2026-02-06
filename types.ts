
export interface ClickerSettings {
  interval: number;
  clickLimit: number;
  isLimited: boolean;
  mode: 'interval' | 'color';
  monitoringPoint: { x: number; y: number } | null;
}

export interface ClickPoint {
  x: number;
  y: number;
  id: number;
}
