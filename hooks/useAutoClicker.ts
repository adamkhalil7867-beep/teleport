
import { useState, useEffect, useRef, useCallback } from 'react';
import type { ClickerSettings } from '../types';

export const useAutoClicker = (
  settings: ClickerSettings,
  onNewClick: (x: number, y: number) => void
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const clickerIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const monitoredColorRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (clickerIntervalRef.current) {
      clearInterval(clickerIntervalRef.current);
      clickerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleLimitedClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (settings.isLimited && newCount >= settings.clickLimit) {
        stop();
      }
      return newCount;
    });
  }, [settings.isLimited, settings.clickLimit, stop]);

  const colorCheckLoop = useCallback(() => {
    if (!settings.monitoringPoint) {
      stop();
      return;
    }

    const element = document.elementFromPoint(settings.monitoringPoint.x, settings.monitoringPoint.y);
    const currentColor = element ? window.getComputedStyle(element).backgroundColor : 'rgba(0, 0, 0, 0)';

    if (monitoredColorRef.current && currentColor !== monitoredColorRef.current) {
      onNewClick(settings.monitoringPoint.x, settings.monitoringPoint.y);
      monitoredColorRef.current = currentColor;
      handleLimitedClick();
    }
    
    if (isRunning) {
        animationFrameRef.current = requestAnimationFrame(colorCheckLoop);
    }
  }, [settings.monitoringPoint, onNewClick, handleLimitedClick, stop, isRunning]);

  const start = useCallback(() => {
    if (isRunning) return;

    setElapsedTime(0);
    setClickCount(0);
    setIsRunning(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(Date.now() - startTimeRef.current);
      }
    }, 100);

    if (settings.mode === 'interval') {
      clickerIntervalRef.current = window.setInterval(() => {
        const targetEl = document.getElementById('target-area');
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          const randomX = rect.left + Math.random() * rect.width;
          const randomY = rect.top + Math.random() * rect.height;
          onNewClick(randomX, randomY);
        }
        handleLimitedClick();
      }, settings.interval);
    } else if (settings.mode === 'color') {
      if (!settings.monitoringPoint) {
        console.error("No monitoring point selected.");
        stop();
        return;
      }
      const element = document.elementFromPoint(settings.monitoringPoint.x, settings.monitoringPoint.y);
      monitoredColorRef.current = element ? window.getComputedStyle(element).backgroundColor : 'rgba(0, 0, 0, 0)';
      animationFrameRef.current = requestAnimationFrame(colorCheckLoop);
    }

  }, [isRunning, onNewClick, settings, handleLimitedClick, colorCheckLoop, stop]);

  const reset = useCallback(() => {
    stop();
    setClickCount(0);
    setElapsedTime(0);
  }, [stop]);

  useEffect(() => {
    // Re-check running state to control the animation frame loop
    if (isRunning && settings.mode === 'color') {
        animationFrameRef.current = requestAnimationFrame(colorCheckLoop);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, settings.mode, colorCheckLoop]);


  useEffect(() => {
    return () => {
      stop(); // Cleanup on unmount
    };
  }, [stop]);

  return { isRunning, clickCount, elapsedTime, start, stop, reset };
};
