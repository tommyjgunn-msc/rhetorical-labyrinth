// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [teamName, setTeamName] = useState('');
  const [teamNumber, setTeamNumber] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (teamName.trim()) {
      // Store team info in localStorage
      localStorage.setItem('teamName', teamName);
      localStorage.setItem('teamNumber', teamNumber);
      localStorage.setItem('gameStartTime', Date.now().toString());
      localStorage.setItem('penalties', '0');
      
      // Set initial game state
      const gameState = {
        currentChallenge: 1,
        completedChallenges: [],
        hintsUsed: {},
        totalPenalties: 0,
        startTime: Date.now(),
        teamId: teamNumber,
        teamName: teamName
      };
      
      // Save game state to localStorage
      localStorage.setItem(`gameState_${teamNumber}`, JSON.stringify(gameState));
      
      // Redirect to the game page
      router.push(`/game/${teamNumber}`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">The Rhetorical Labyrinth</h1>
      <p className="mb-6 text-gray-700 text-center">
        Enter your team information to begin the escape room challenge.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="teamNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Select your team
          </label>
          <select
            id="teamNumber"
            value={teamNumber}
            onChange={(e) => setTeamNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">Team 1</option>
            <option value="2">Team 2</option>
            <option value="3">Team 3</option>
            <option value="4">Team 4</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? "Loading..." : "Enter the Labyrinth"}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Escape the rhetorical labyrinth within 75 minutes to free Professor Logos!</p>
      </div>
    </div>
  );
}