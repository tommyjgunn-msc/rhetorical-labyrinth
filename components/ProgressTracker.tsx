// components/ProgressTracker.tsx
'use client';

import { challenges } from '@/lib/gameData';

interface ProgressTrackerProps {
  completedChallenges: number[];
  currentChallenge: number;
}

export default function ProgressTracker({ completedChallenges, currentChallenge }: ProgressTrackerProps) {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
      <div className="flex space-x-3">
        {challenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${completedChallenges.includes(challenge.id) 
                ? 'bg-green-500 text-white' 
                : challenge.id === currentChallenge 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'}`}
          >
            {challenge.id}
          </div>
        ))}
      </div>
      <div className="flex space-x-3 mt-2 text-xs text-center">
        {challenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className="w-10 overflow-hidden"
          >
            {completedChallenges.includes(challenge.id) 
              ? '✓' 
              : challenge.id === currentChallenge 
                ? '...' 
                : ''}
          </div>
        ))}
      </div>
    </div>
  );
}