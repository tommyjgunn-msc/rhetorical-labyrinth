// components/Timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/lib/utils';

interface TimerProps {
  initialTime: number; // In minutes
  penalties: number; // In minutes
  teamId: string;
  onTimeUp: () => void;
}

export default function Timer({ initialTime, penalties, teamId, onTimeUp }: TimerProps) {
  // Convert minutes to milliseconds
  const totalTimeAllowed = (initialTime + penalties) * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(totalTimeAllowed);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get the saved start time or use current time
    const startTimeStr = localStorage.getItem('gameStartTime') || Date.now().toString();
    const startTime = parseInt(startTimeStr, 10);
    
    // Get stored penalties
    const storedPenalties = parseInt(localStorage.getItem('penalties') || '0', 10);
    
    // Calculate elapsed time
    const now = Date.now();
    const elapsed = now - startTime;
    
    // Calculate remaining time including penalties
    const totalAllowedTime = (initialTime + storedPenalties) * 60 * 1000;
    const remaining = Math.max(0, totalAllowedTime - elapsed);
    
    setTimeLeft(remaining);
    
    if (remaining <= 0) {
      setIsExpired(true);
      onTimeUp();
      return;
    }
    
    // Update timer every second
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1000;
        
        if (newTime <= 0) {
          clearInterval(timer);
          setIsExpired(true);
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [initialTime, penalties, teamId, onTimeUp]);
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  
  return (
    <div className={`text-xl font-bold ${timeLeft < 300000 ? "text-red-600" : timeLeft < 600000 ? "text-yellow-600" : "text-green-600"}`}>
      Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      {isExpired && <span className="ml-2">(TIME'S UP!)</span>}
    </div>
  );
}