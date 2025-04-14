// components/challenges/Challenge3.tsx
'use client';

import { useState } from 'react';
import { Challenge as ChallengeType } from '@/lib/types';

interface Approach {
  id: number;
  audience: string;
  topic: string;
  text: string;
  correct: boolean;
}

interface Challenge3Props {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

export default function Challenge3({ challenge, onSolve, onUseHint, hintsUsed }: Challenge3Props) {
  const audiences = challenge.content.audiences || [];
  const topics = challenge.content.topics || [];
  const approaches = challenge.content.approaches || [];

  const [selectedApproaches, setSelectedApproaches] = useState<{[key: string]: number}>({});
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [prediction, setPrediction] = useState<{shown: boolean, audience: string, topic: string}>({
    shown: false,
    audience: '',
    topic: ''
  });

  // Group approaches by audience and topic
  const approachesByAudienceAndTopic: {[key: string]: Approach[]} = {};
  
  approaches.forEach(approach => {
    const key = `${approach.audience}-${approach.topic}`;
    if (!approachesByAudienceAndTopic[key]) {
      approachesByAudienceAndTopic[key] = [];
    }
    approachesByAudienceAndTopic[key].push(approach as Approach);
  });

  const handleSelectApproach = (audience: string, topic: string, approachId: number) => {
    const key = `${audience}-${topic}`;
    
    // Trigger the "mind-reading" gag on first selection if not yet shown
    if (!prediction.shown && Object.keys(selectedApproaches).length === 0) {
      setPrediction({
        shown: true,
        audience,
        topic
      });
      setTimeout(() => {
        setPrediction({
          shown: false,
          audience: '',
          topic: ''
        });
      }, 5000);
    }
    
    setSelectedApproaches({
      ...selectedApproaches,
      [key]: approachId
    });
  };

  const checkSolution = () => {
    // Check if all cells have selections
    const totalCells = audiences.length * topics.length;
    if (Object.keys(selectedApproaches).length !== totalCells) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 2000);
      return;
    }
    
    // Check if all selections are correct
    const allCorrect = Object.entries(selectedApproaches).every(([key, approachId]) => {
      const [audience, topic] = key.split('-');
      const selectedApproach = approaches.find(a => 
        a.id === approachId && 
        a.audience === audience && 
        a.topic === topic
      ) as Approach;
      
      return selectedApproach && selectedApproach.correct;
    });
    
    if (allCorrect) {
      setIsSolved(true);
      onSolve(challenge.id);
    } else {
      setIsIncorrect(true);
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
      
      {prediction.shown && (
        <div className="mb-4 p-3 bg-purple-100 border border-purple-300 rounded-md">
          <p className="text-purple-800">
            <span className="font-bold">The Sophist says:</span> "Ah, I see you're interested in appealing to {prediction.audience} about {prediction.topic}. 
            A predictable choice! But will you select the most effective approach? I doubt it..."
          </p>
        </div>
      )}
      
      {isSolved ? (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 my-4">
          <p className="font-bold">Challenge Solved! 🎉</p>
          <p>You've successfully completed the audience analysis matrix!</p>
          <p className="mt-2">The hidden map reveals: {challenge.content.solution}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-100"></th>
                  {topics.map(topic => (
                    <th key={topic} className="border p-2 bg-gray-100 font-medium">
                      {topic}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {audiences.map(audience => (
                  <tr key={audience}>
                    <td className="border p-2 bg-gray-100 font-medium">
                      {audience}
                    </td>
                    {topics.map(topic => {
                      const cellKey = `${audience}-${topic}`;
                      const cellApproaches = approachesByAudienceAndTopic[cellKey] || [];
                      const selectedApproachId = selectedApproaches[cellKey];
                      
                      return (
                        <td key={`${audience}-${topic}`} className="border p-3 min-w-64">
                          <div className="space-y-2">
                            {selectedApproachId ? (
                              <div className="bg-blue-50 p-2 border border-blue-200 rounded-md">
                                <p className="text-sm">
                                  {cellApproaches.find(a => a.id === selectedApproachId)?.text}
                                </p>
                                <button
                                  onClick={() => {
                                    const newSelected = {...selectedApproaches};
                                    delete newSelected[cellKey];
                                    setSelectedApproaches(newSelected);
                                  }}
                                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                                >
                                  Change selection
                                </button>
                              </div>
                            ) : (
                              <select
                                className="w-full p-2 border rounded-md text-sm"
                                onChange={(e) => {
                                  const approachId = parseInt(e.target.value);
                                  if (approachId) {
                                    handleSelectApproach(audience, topic, approachId);
                                  }
                                }}
                                value=""
                              >
                                <option value="">Select the best approach</option>
                                {cellApproaches.map(approach => (
                                  <option key={approach.id} value={approach.id}>
                                    {approach.text.substring(0, 40)}...
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">
                Cells completed: {Object.keys(selectedApproaches).length} / {audiences.length * topics.length}
              </span>
            </div>
            <button
              onClick={checkSolution}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Check Solution
            </button>
          </div>
          
          {isIncorrect && (
            <p className="mt-1 text-sm text-red-600">
              Your solution is incorrect. Check your selections and try again.
            </p>
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