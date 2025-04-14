'use client';

import { useState } from 'react';
import { Challenge as ChallengeType } from '@/lib/types';

interface ChallengeProps {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

export default function Challenge({ challenge, onSolve, onUseHint, hintsUsed }: ChallengeProps) {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answer.trim().toUpperCase() === challenge.content.solution.toUpperCase()) {
      setIsSolved(true);
      onSolve(challenge.id);
    } else {
      setIsIncorrect(true);
      // Reset after 2 seconds
      setTimeout(() => setIsIncorrect(false), 2000);
    }
  };

  const handleHint = (hintIndex: number) => {
    if (!hintsUsed.includes(hintIndex)) {
      onUseHint(challenge.id, hintIndex);
    }
    setShowHint(hintIndex);
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${isSolved ? 'border-2 border-green-500' : ''}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-gray-700 mb-2">{challenge.description}</p>
        <p className="text-gray-800 font-medium">{challenge.instructions}</p>
      </div>
      
      {isSolved ? (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 my-4">
          <p className="font-bold">Challenge Solved! 🎉</p>
          <p>You've successfully completed this challenge and can now proceed to the next one.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
              Enter solution:
            </label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${isIncorrect ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Enter your answer here..."
              required
            />
            {isIncorrect && (
              <p className="mt-1 text-sm text-red-600">
                Incorrect answer. Try again!
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Answer
          </button>
        </form>
      )}
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-semibold">Need help?</h3>
          <p className="text-sm text-gray-500">Each hint adds a {challenge.timePenalty}-minute penalty</p>
        </div>
        <div className="flex space-x-2">
          {challenge.hints.map((hint, index) => (
            <button
              key={index}
              onClick={() => handleHint(index)}
              className={`px-3 py-1 text-sm rounded-md ${
                hintsUsed.includes(index)
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
              disabled={hintsUsed.includes(index)}
            >
              Hint {index + 1}
            </button>
          ))}
        </div>
        {showHint !== null && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-gray-800">{challenge.hints[showHint]}</p>
          </div>
        )}
      </div>
    </div>
  );
}