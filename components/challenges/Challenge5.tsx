// components/challenges/Challenge5.tsx
'use client';

import { useState } from 'react';
import { Challenge as ChallengeType } from '@/lib/types';

interface Component {
  id: number;
  type: string;
  text: string;
  correct: boolean;
}

interface Flaw {
  id: number;
  text: string;
}

interface Challenge5Props {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

export default function Challenge5({ challenge, onSolve, onUseHint, hintsUsed }: Challenge5Props) {
  const components = challenge.content.components || [];
  const flaws = challenge.content.flaws || [];
  const correctOrder = challenge.content.order || [];
  
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [availableComponents, setAvailableComponents] = useState<Component[]>(components);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [phase, setPhase] = useState<'construct' | 'critique'>('construct');
  const [identifiedFlaws, setIdentifiedFlaws] = useState<number[]>([]);
  const [showTwist, setShowTwist] = useState<boolean>(false);
  
  const handleSelectComponent = (component: Component) => {
    setSelectedComponents([...selectedComponents, component]);
    setAvailableComponents(availableComponents.filter(c => c.id !== component.id));
  };
  
  const handleRemoveComponent = (index: number) => {
    const removedComponent = selectedComponents[index];
    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
    setAvailableComponents([...availableComponents, removedComponent]);
  };
  
  const handleMoveComponent = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === selectedComponents.length - 1)
    ) {
      return;
    }
    
    const newComponents = [...selectedComponents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newComponents[index], newComponents[targetIndex]] = 
      [newComponents[targetIndex], newComponents[index]];
    
    setSelectedComponents(newComponents);
  };
  
  const checkConstructionSolution = () => {
    // Check if all correct components are selected in the right order
    const selectedIds = selectedComponents.map(c => c.id);
    
    // Check if we have enough components
    if (selectedIds.length < correctOrder.length) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 2000);
      return;
    }
    
    // Check if only correct components are selected
    const allCorrect = selectedComponents.every(c => c.correct);
    if (!allCorrect) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 2000);
      return;
    }
    
    // Show the twist - reveal that they've been helping the Sophist
    setShowTwist(true);
    setTimeout(() => {
      setShowTwist(false);
      setPhase('critique');
    }, 5000);
  };

  const handleIdentifyFlaw = (flawId: number) => {
    if (identifiedFlaws.includes(flawId)) {
      // Remove the flaw if already identified
      setIdentifiedFlaws(identifiedFlaws.filter(id => id !== flawId));
    } else {
      // Add the flaw
      setIdentifiedFlaws([...identifiedFlaws, flawId]);
    }
  };

  const checkCritiqueSolution = () => {
    // Check if all flaws have been identified
    if (identifiedFlaws.length === flaws.length) {
      // Check if all identified flaws are correct
      const allFlawsCorrect = flaws.every(flaw => 
        identifiedFlaws.includes(flaw.id)
      );
      
      if (allFlawsCorrect) {
        setIsSolved(true);
        onSolve(challenge.id);
      } else {
        setIsIncorrect(true);
        setTimeout(() => setIsIncorrect(false), 2000);
      }
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

  // Helper function to get component type label
  const getComponentTypeLabel = (type: string): string => {
    switch (type) {
      case 'thesis': return 'Thesis Statement';
      case 'reason1': return 'Reason 1';
      case 'reason2': return 'Reason 2';
      case 'reason3': return 'Reason 3';
      case 'evidence1': return 'Evidence 1';
      case 'evidence2': return 'Evidence 2';
      case 'evidence3': return 'Evidence 3';
      case 'counterargument': return 'Counterargument';
      case 'refutation': return 'Refutation';
      case 'conclusion': return 'Conclusion';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${isSolved ? 'border-2 border-green-500' : ''}`}>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-gray-700 mb-2">{challenge.description}</p>
        <p className="text-gray-800 font-medium">{challenge.instructions}</p>
      </div>

      {showTwist && (
        <div className="mb-6 p-4 bg-purple-100 border-2 border-purple-400 rounded-md shadow-lg">
          <h3 className="font-bold text-purple-800 mb-2">The Sophist Appears!</h3>
          <p className="text-purple-700">
            "Aha! You've done exactly as I wanted! That argument you so carefully constructed... it's full of subtle flaws!"
          </p>
          <p className="text-purple-700 mt-2">
            "Now, prove your rhetorical mastery by identifying the weaknesses I've hidden within the argument's structure."
          </p>
        </div>
      )}
      
      {isSolved ? (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 my-4">
          <p className="font-bold">Challenge Solved! 🎉</p>
          <p>You've successfully identified all the flaws in the argument!</p>
          <p className="mt-2">The final key is: {challenge.content.solution}</p>
        </div>
      ) : phase === 'construct' ? (
        <div className="space-y-6">
          {/* Construction Phase */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-3">Phase 1: Construct an Argument</h3>
            <p className="text-sm mb-4">
              Build a persuasive argument by selecting components and arranging them in a logical order.
            </p>
            
            {/* Selected Components */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Your Argument ({selectedComponents.length}/{correctOrder.length} components)</h4>
              {selectedComponents.length > 0 ? (
                <div className="space-y-2">
                  {selectedComponents.map((component, index) => (
                    <div key={index} className="flex items-center bg-white p-3 border rounded-md">
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                        {getComponentTypeLabel(component.type)}
                      </div>
                      <p className="flex-grow text-sm">{component.text}</p>
                      <div className="flex items-center ml-2 space-x-1">
                        <button
                          onClick={() => handleMoveComponent(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded ${
                            index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveComponent(index, 'down')}
                          disabled={index === selectedComponents.length - 1}
                          className={`p-1 rounded ${
                            index === selectedComponents.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveComponent(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed rounded-md text-center text-gray-500">
                  Select components to build your argument
                </div>
              )}
            </div>
            
            {/* Available Components */}
            <div>
              <h4 className="font-medium mb-2">Available Components</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableComponents.map(component => (
                  <div 
                    key={component.id}
                    onClick={() => handleSelectComponent(component)}
                    className="p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {component.type.includes('redherring') ? 'Component ' + component.id : getComponentTypeLabel(component.type)}
                    </div>
                    <p className="text-sm">{component.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={checkConstructionSolution}
                disabled={selectedComponents.length < correctOrder.length}
                className={`px-4 py-2 rounded-md ${
                  selectedComponents.length < correctOrder.length
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Check Argument Structure
              </button>
              {isIncorrect && (
                <p className="mt-2 text-sm text-red-600">
                  Your argument has issues. Make sure you've selected only appropriate components and arranged them logically.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Critique Phase */}
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <h3 className="font-semibold text-purple-800 mb-3">Phase 2: Critique the Argument</h3>
            <p className="text-sm mb-4">
              The Sophist has hidden flaws in this persuasive argument. Identify them all to solve the challenge.
            </p>
            
            {/* Display the full argument */}
            <div className="mb-6 space-y-2">
              <h4 className="font-medium">The Argument:</h4>
              {selectedComponents.map((component, index) => (
                <div key={index} className="bg-white p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold mr-2">
                      {getComponentTypeLabel(component.type)}
                    </div>
                    <p className="text-sm">{component.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Identify flaws section */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Identify Flaws ({identifiedFlaws.length}/{flaws.length}):</h4>
              {flaws.map(flaw => (
                <div key={flaw.id} className="mb-2 flex items-start">
                  <input
                    type="checkbox"
                    id={`flaw-${flaw.id}`}
                    checked={identifiedFlaws.includes(flaw.id)}
                    onChange={() => handleIdentifyFlaw(flaw.id)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={`flaw-${flaw.id}`} className="text-sm cursor-pointer">
                    {flaw.text}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                onClick={checkCritiqueSolution}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Submit Critique
              </button>
              {isIncorrect && (
                <p className="mt-2 text-sm text-red-600">
                  Your critique is not complete. Make sure you've identified all the flaws in the argument.
                </p>
              )}
            </div>
          </div>
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