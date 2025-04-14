'use client';

import { useState } from 'react';
import { Challenge as ChallengeType, Statement } from '@/lib/types';

interface Challenge1Props {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

export default function Challenge1({ challenge, onSolve, onUseHint, hintsUsed }: Challenge1Props) {
  const [selectedStatements, setSelectedStatements] = useState<Statement[]>([]);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [code, setCode] = useState('');
  
  const statements = challenge.content.statements || [];

  const handleSelectStatement = (statement: Statement) => {
    // If already selected, remove it
    if (selectedStatements.some(s => s.id === statement.id)) {
      setSelectedStatements(selectedStatements.filter(s => s.id !== statement.id));
    } 
    // If we have less than 3 selected, add it
    else if (selectedStatements.length < 3) {
      setSelectedStatements([...selectedStatements, statement]);
    }
  };

  const generateCode = () => {
    if (selectedStatements.length !== 3) return;
    
    // Sort by value (weakest to strongest)
    const sortedStatements = [...selectedStatements].sort((a, b) => a.value - b.value);
    const code = sortedStatements.map(s => s.id).join('');
    setCode(code);
    
    if (code === challenge.content.solution) {
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
          <p>You've successfully identified the proper thesis statements and arranged them in the correct order.</p>
          <p className="mt-2">Code: {challenge.content.solution}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statements.map((statement) => (
              <div
                key={statement.id}
                onClick={() => handleSelectStatement(statement)}
                className={`p-4 border rounded-md cursor-pointer transition-colors 
                  ${selectedStatements.some(s => s.id === statement.id)
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
              >
                <p>{statement.text}</p>
                {selectedStatements.some(s => s.id === statement.id) && (
                  <div className="mt-2 text-blue-600 font-medium">Selected</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-2">Selected Statements ({selectedStatements.length}/3):</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStatements.map((statement) => (
                <div key={statement.id} className="bg-blue-50 border border-blue-200 rounded-md p-2">
                  Statement #{statement.id}: {statement.text.substring(0, 30)}...
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={generateCode}
            disabled={selectedStatements.length !== 3}
            className={`px-4 py-2 rounded-md ${
              selectedStatements.length === 3
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-700 cursor-not-allowed'
            }`}
          >
            Generate Code
          </button>
          
          {isIncorrect && (
            <p className="mt-1 text-sm text-red-600">
              Incorrect code. Try a different selection or order!
            </p>
          )}
          
          {code && !isSolved && (
            <div className="mt-2 p-2 bg-gray-100 rounded-md">
              Generated Code: {code}
            </div>
          )}
        </div>
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