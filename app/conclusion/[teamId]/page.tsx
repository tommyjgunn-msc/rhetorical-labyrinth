'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatTotalTime, getTotalGameTime, loadGameState } from '@/lib/utils';
import { challenges, gameSettings } from '@/lib/gameData';
import { GameState } from '@/lib/types';

export default function ConclusionPage({ params }: { params: { teamId: string } }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [totalTime, setTotalTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load game state from localStorage
    const savedState = loadGameState(params.teamId);
    
    if (savedState) {
      setGameState(savedState);
      
      // Calculate total time
      const endTime = savedState.endTime || Date.now();
      const totalTimeMs = getTotalGameTime(savedState.startTime, endTime, savedState.totalPenalties);
      setTotalTime(formatTotalTime(totalTimeMs));
    } else {
      // No saved state, redirect to home
      router.push('/');
    }
    
    setIsLoading(false);
  }, [params.teamId, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No game data found.</p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const allChallengesCompleted = gameState.completedChallenges.length === challenges.length;
  const completedPercentage = Math.round((gameState.completedChallenges.length / challenges.length) * 100);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center">Rhetorical Labyrinth Results</h1>
          <p className="text-xl text-center mb-6">Team: {gameState.teamName}</p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-bold mb-2 text-center">
              {allChallengesCompleted 
                ? "Congratulations! You've escaped the Labyrinth!" 
                : "Time's up! Your journey through the Labyrinth has ended."}
            </h2>
            
            <div className="text-center">
              <p className="text-xl mb-2">Total Time: {totalTime}</p>
              <p className="text-lg">
                Challenges Completed: {gameState.completedChallenges.length} of {challenges.length} ({completedPercentage}%)
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-3">Challenge Progress:</h3>
            <div className="space-y-3">
              {challenges.map(challenge => {
                const completed = gameState.completedChallenges.includes(challenge.id);
                return (
                  <div 
                    key={challenge.id}
                    className={`p-3 rounded-md ${completed ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300'} border`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        completed ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}>
                        {completed ? '✓' : challenge.id}
                      </div>
                      <div>
                        <h4 className="font-bold">{challenge.title}</h4>
                        <p className="text-sm">{challenge.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {gameState.totalPenalties > 0 && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
              <p className="font-medium">
                Time Penalties: {gameState.totalPenalties} minutes
              </p>
              <p className="text-sm">
                Hints used: {Object.values(gameState.hintsUsed).flat().length}
              </p>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold mb-3">Professor Logos says:</h3>
            <p className="italic mb-4">
              {allChallengesCompleted 
                ? "You have mastered the art of rhetoric and defeated the Sophist! Your command of ethos, pathos, and logos has freed me from the Labyrinth. The world needs more critical thinkers like you!"
                : "Though our journey through the Labyrinth is incomplete, you've shown great potential in the rhetorical arts. Remember that learning to recognize and craft effective arguments is a lifelong endeavor."}
            </p>
            
            <div className="flex justify-center space-x-4 mt-6">
              <Link 
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Return to Home
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('gameState');
                  localStorage.removeItem('penalties');
                  router.push('/');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Start New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}