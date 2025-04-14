'use client';

import { useState, useEffect } from 'react';
import { Challenge as ChallengeType } from '@/lib/types';

interface Option {
  id: string;
  text: string;
  correct: boolean;
  next?: number | string;
  fallacy?: string;
}

interface Path {
  id: number;
  counterargument: string;
  options: Option[];
}

interface Challenge4Props {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

interface HistoryStep {
  step: number;
  choice: string;
}

export default function Challenge4({ challenge, onSolve, onUseHint, hintsUsed }: Challenge4Props) {
  const [currentPath, setCurrentPath] = useState<number>(1);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [history, setHistory] = useState<HistoryStep[]>([]);
  const [feedback, setFeedback] = useState<{message: string, isError: boolean} | null>(null);
  const [mazeRotation, setMazeRotation] = useState<number>(0);
  const [sophist, setSophist] = useState<boolean>(false);
  
  const startPoint = challenge.content.startPoint || "";
  const paths = challenge.content.paths || [];
  
  useEffect(() => {
    // Randomly rotate maze every 15 seconds
    const rotationInterval = setInterval(() => {
      if (!isSolved) {
        setMazeRotation(Math.floor(Math.random() * 4) * 2 - 3); // Random value between -3 and 3
        setFeedback({
          message: "The maze is shifting around you...",
          isError: false
        });
        setTimeout(() => setFeedback(null), 2000);
      }
    }, 15000);
    
    // Random Sophist encounter (20% chance every 20 seconds)
    const sophistInterval = setInterval(() => {
      if (!isSolved && Math.random() < 0.2) {
        setSophist(true);
        setTimeout(() => setSophist(false), 8000);
      }
    }, 20000);
    
    return () => {
      clearInterval(rotationInterval);
      clearInterval(sophistInterval);
    };
  }, [isSolved]);

  const currentPathData = paths.find(p => p.id === currentPath);
  
  const handleSelectOption = (option: Option) => {
    if (option.correct) {
      setHistory([...history, { step: currentPath, choice: option.id }]);
      
      if (option.next === "end" || !option.next) {
        // Player has reached the end of the maze
        setIsSolved(true);
        onSolve(challenge.id);
      } else {
        // Move to next path
        if (typeof option.next === 'number') {
          setCurrentPath(option.next);
        }
        setFeedback({
          message: "Correct choice! Moving forward...",
          isError: false
        });
        setTimeout(() => setFeedback(null), 2000);
      }
    } else {
      // Wrong path - hit a fallacy
      setIsIncorrect(true);
      setFeedback({
        message: `Logical fallacy: ${option.fallacy}. Going back...`,
        isError: true
      });
      
      // Go back to start or previous step
      setTimeout(() => {
        setIsIncorrect(false);
        setFeedback(null);
        
        // 30% chance to go back to the beginning, otherwise go back one step
        if (Math.random() < 0.3 || history.length === 0) {
          setCurrentPath(1);
          setHistory([]);
        } else {
          const newHistory = [...history];
          newHistory.pop();
          setHistory(newHistory);
          
          if (newHistory.length > 0) {
            const lastStep = newHistory[newHistory.length - 1];
            const lastPath = paths.find(p => p.id === lastStep.step);
            if (lastPath) {
              const lastOption = lastPath.options.find((o: { id: string; }) => o.id === lastStep.choice);
              if (lastOption?.next && typeof lastOption.next === 'number') {
                setCurrentPath(lastOption.next);
              } else {
                setCurrentPath(1);
              }
            } else {
              setCurrentPath(1);
            }
          } else {
            setCurrentPath(1);
          }
        }
      }, 2500);
    }
  };

  const handleSophistRiddle = () => {
    // Remove the Sophist and continue
    setSophist(false);
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
      
      {sophist && (
        <div className="mb-4 p-4 bg-purple-100 border-2 border-purple-400 rounded-md shadow-md">
          <h3 className="font-bold text-purple-800 mb-2">The Sophist Appears!</h3>
          <p className="mb-2">
            "Ah, wanderer in my labyrinth! To proceed, you must answer my riddle:"
          </p>
          <p className="italic mb-4">
            "What comes once in a minute, twice in a moment, but never in a thousand years?"
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                handleSophistRiddle();
                setFeedback({
                  message: "Correct! The letter 'M'. The Sophist vanishes...",
                  isError: false
                });
                setTimeout(() => setFeedback(null), 2000);
              }}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              The letter 'M'
            </button>
            <button 
              onClick={() => {
                setFeedback({
                  message: "Incorrect! The Sophist laughs at your failure...",
                  isError: true
                });
                setTimeout(() => {
                  setFeedback(null);
                  handleSophistRiddle();
                }, 2000);
              }}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Time
            </button>
            <button 
              onClick={() => {
                setFeedback({
                  message: "Incorrect! The Sophist mocks your reasoning...",
                  isError: true
                });
                setTimeout(() => {
                  setFeedback(null);
                  handleSophistRiddle();
                }, 2000);
              }}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              A heartbeat
            </button>
          </div>
        </div>
      )}
      
      {isSolved ? (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 my-4">
          <p className="font-bold">Challenge Solved! 🎉</p>
          <p>You've successfully navigated the Counterargument Labyrinth!</p>
          <p className="mt-2">The key phrase is: {challenge.content.solution}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Maze visualization */}
          <div className={`p-4 border-2 border-gray-300 rounded-md bg-gray-50 transform rotate-${mazeRotation}`}>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Your Position in the Maze:</h3>
              <div className="flex justify-center">
                {[1, 2, 3, 4].map(step => (
                  <div 
                    key={step} 
                    className={`w-16 h-16 flex items-center justify-center m-1 rounded-md ${
                      currentPath === step 
                        ? 'bg-blue-500 text-white' 
                        : history.some(h => h.step === step)
                          ? 'bg-green-200 border border-green-500'
                          : 'bg-gray-200'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Current argument */}
          <div className="p-4 border rounded-md bg-white">
            <h3 className="font-semibold mb-1">Starting Claim:</h3>
            <p className="italic mb-4">{startPoint}</p>
            
            {currentPathData && (
              <>
                <h3 className="font-semibold mb-1">Counterargument:</h3>
                <p className="mb-4 text-red-700">{currentPathData.counterargument}</p>
                
                <h3 className="font-semibold mb-2">How do you respond?</h3>
                <div className="space-y-3">
                  {currentPathData.options.map((option: Option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-3 text-left border rounded-md hover:bg-gray-50 
                        ${isIncorrect ? 'cursor-not-allowed opacity-50' : ''}`}
                      disabled={isIncorrect}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {feedback && (
            <div className={`p-3 rounded-md ${
              feedback.isError ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {feedback.message}
            </div>
          )}
          
          {history.length > 0 && (
            <div className="p-3 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-1">Your path so far:</h3>
              <div className="text-xs">
                {history.map((step, index) => (
                  <span key={index}>
                    Step {step.step} ({step.choice})
                    {index < history.length - 1 ? ' → ' : ''}
                  </span>
                ))}
              </div>
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