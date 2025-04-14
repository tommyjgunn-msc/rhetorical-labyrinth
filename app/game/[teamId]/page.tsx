// app/game/[teamId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Timer from '@/components/Timer';
import ProgressTracker from '@/components/ProgressTracker';
import Challenge from '@/components/Challenge';
import Challenge1 from '@/components/challenges/Challenge1';
import Challenge2 from '@/components/challenges/Challenge2';
import Challenge3 from '@/components/challenges/Challenge3';
import Challenge4 from '@/components/challenges/Challenge4';
import Challenge5 from '@/components/challenges/Challenge5';
import { challenges, gameSettings, initialGameState } from '@/lib/gameData';
import { loadGameState, saveGameState, isTimerExpired } from '@/lib/utils';
import { GameState } from '@/lib/types';

export default function GamePage({ params }: { params: { teamId: string } }) {
  const [gameState, setGameState] = useState<GameState>({
    ...initialGameState,
    teamId: params.teamId,
    teamName: '',
    startTime: Date.now()
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing game state in localStorage
    const savedState = loadGameState(params.teamId);
    
    if (savedState) {
      setGameState(savedState);
    } else {
      // Get team name from localStorage
      const teamName = localStorage.getItem('teamName') || 'Team ' + params.teamId;
      const startTime = parseInt(localStorage.getItem('gameStartTime') || Date.now().toString(), 10);
      
      // Initialize new game state
      const newState = {
        ...initialGameState,
        teamId: params.teamId,
        teamName,
        startTime
      };
      
      setGameState(newState);
      saveGameState(newState);
    }
    
    setIsLoading(false);
  }, [params.teamId]);

  useEffect(() => {
    // Check if time has expired
    const checkTimer = () => {
      if (isTimerExpired(gameState.startTime, gameSettings.totalTime, gameState.totalPenalties)) {
        // Time's up, redirect to conclusion page
        router.push(`/conclusion/${params.teamId}`);
      }
    };
    
    checkTimer();
    const timerInterval = setInterval(checkTimer, 1000);
    
    return () => clearInterval(timerInterval);
  }, [gameState.startTime, gameState.totalPenalties, params.teamId, router]);

  const handleSolveChallenge = (challengeId: number) => {
    // Mark challenge as completed
    const newState = {
      ...gameState,
      completedChallenges: [...gameState.completedChallenges, challengeId],
      currentChallenge: challengeId + 1
    };
    
    setGameState(newState);
    saveGameState(newState);
    
    // Check if all challenges are completed
    if (newState.completedChallenges.length === challenges.length) {
      // Set end time
      const finalState = {
        ...newState,
        endTime: Date.now()
      };
      
      setGameState(finalState);
      saveGameState(finalState);
      
      // Redirect to conclusion page
      router.push(`/conclusion/${params.teamId}`);
    }
  };

  const handleUseHint = (challengeId: number, hintIndex: number) => {
    // Check if hint was already used
    if (gameState.hintsUsed[challengeId]?.includes(hintIndex)) {
      return;
    }
    
    // Add hint to used hints
    const hintsForChallenge = gameState.hintsUsed[challengeId] || [];
    
    const newState = {
      ...gameState,
      hintsUsed: {
        ...gameState.hintsUsed,
        [challengeId]: [...hintsForChallenge, hintIndex]
      },
      totalPenalties: gameState.totalPenalties + gameSettings.timePenaltyPerHint
    };
    
    // Update localStorage
    localStorage.setItem('penalties', newState.totalPenalties.toString());
    
    setGameState(newState);
    saveGameState(newState);
  };

  const handleTimeUp = () => {
    // Redirect to conclusion page
    router.push(`/conclusion/${params.teamId}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading game...</p>
      </div>
    );
  }

  // Get current challenge
  const currentChallengeObj = challenges.find(c => c.id === gameState.currentChallenge) || challenges[0];
  
  // Get hints used for current challenge
  const hintsUsedForCurrentChallenge = gameState.hintsUsed[currentChallengeObj.id] || [];

  // Determine which challenge component to render
  const renderChallengeComponent = () => {
    switch (currentChallengeObj.id) {
      case 1:
        return (
          <Challenge1
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
      case 2:
        return (
          <Challenge2
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
      case 3:
        return (
          <Challenge3
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
      case 4:
        return (
          <Challenge4
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
      case 5:
        return (
          <Challenge5
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
      default:
        return (
          <Challenge
            challenge={currentChallengeObj}
            onSolve={handleSolveChallenge}
            onUseHint={handleUseHint}
            hintsUsed={hintsUsedForCurrentChallenge}
          />
        );
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">The Rhetorical Labyrinth</h1>
            <p className="text-gray-600">Team: {gameState.teamName}</p>
          </div>
          
          <Timer
            initialTime={gameSettings.totalTime}
            penalties={gameState.totalPenalties}
            teamId={params.teamId}
            onTimeUp={handleTimeUp}
          />
        </div>
        
        <ProgressTracker
          completedChallenges={gameState.completedChallenges}
          currentChallenge={gameState.currentChallenge}
        />
        
        {renderChallengeComponent()}
        
        {gameState.totalPenalties > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              Time Penalties: {gameState.totalPenalties} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}