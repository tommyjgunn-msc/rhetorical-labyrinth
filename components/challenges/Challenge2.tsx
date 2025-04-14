'use client';

import { useState } from 'react';
import { Challenge as ChallengeType, Evidence, Claim } from '@/lib/types';

interface Challenge2Props {
  challenge: ChallengeType;
  onSolve: (challengeId: number) => void;
  onUseHint: (challengeId: number, hintIndex: number) => void;
  hintsUsed: number[];
}

export default function Challenge2({ challenge, onSolve, onUseHint, hintsUsed }: Challenge2Props) {
  const [categorizedEvidence, setCategorizedEvidence] = useState<{
    ethos: Evidence[];
    pathos: Evidence[];
    logos: Evidence[];
    uncategorized: Evidence[];
  }>({
    ethos: [],
    pathos: [],
    logos: [],
    uncategorized: challenge.content.evidence || []
  });
  
  const [claimEvidence, setClaimEvidence] = useState<{
    [claimId: number]: {
      ethos?: Evidence;
      pathos?: Evidence;
      logos?: Evidence;
    };
  }>({});
  
  const [showHint, setShowHint] = useState<number | null>(null);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [trapTriggered, setTrapTriggered] = useState<number | null>(null);
  
  const categories = challenge.content.categories || [];
  const claims = challenge.content.claims || [];
  const traps = challenge.content.traps || [];

  const handleCategorizeEvidence = (evidence: Evidence, category: string) => {
    // Check if the evidence is already in this category
    const isAlreadyCategorized = categorizedEvidence[category as keyof typeof categorizedEvidence]
      .some(e => e.id === evidence.id);
    
    if (isAlreadyCategorized) return;
    
    // Check if it's a trap
    if (traps.includes(evidence.id)) {
      setTrapTriggered(evidence.id);
      setTimeout(() => setTrapTriggered(null), 3000);
      return;
    }
    
    // Remove from current category
    let newCategorizedEvidence = { ...categorizedEvidence };
    
    // Remove from uncategorized if it's there
    if (newCategorizedEvidence.uncategorized.some(e => e.id === evidence.id)) {
      newCategorizedEvidence.uncategorized = newCategorizedEvidence.uncategorized
        .filter(e => e.id !== evidence.id);
    }
    
    // Remove from other categories if it's there
    ['ethos', 'pathos', 'logos'].forEach(cat => {
      if (cat !== category && newCategorizedEvidence[cat as keyof typeof newCategorizedEvidence].some(e => e.id === evidence.id)) {
        newCategorizedEvidence[cat as keyof typeof newCategorizedEvidence] = 
          newCategorizedEvidence[cat as keyof typeof newCategorizedEvidence]
            .filter(e => e.id !== evidence.id);
      }
    });
    
    // Add to new category
    newCategorizedEvidence[category as keyof typeof categorizedEvidence] = [
      ...newCategorizedEvidence[category as keyof typeof categorizedEvidence],
      evidence
    ];
    
    setCategorizedEvidence(newCategorizedEvidence);
  };

  const assignEvidenceToClaim = (claim: Claim, evidence: Evidence, type: 'ethos' | 'pathos' | 'logos') => {
    setClaimEvidence({
      ...claimEvidence,
      [claim.id]: {
        ...claimEvidence[claim.id],
        [type]: evidence
      }
    });
  };

  const checkSolution = () => {
    // Check if all claims have all three types of evidence
    const allClaimsComplete = claims.every(claim => 
      claimEvidence[claim.id] && 
      claimEvidence[claim.id].ethos && 
      claimEvidence[claim.id].pathos && 
      claimEvidence[claim.id].logos
    );
    
    if (allClaimsComplete) {
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
      
      {isSolved ? (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 my-4">
          <p className="font-bold">Challenge Solved! 🎉</p>
          <p>You've successfully sorted the evidence and matched it to claims.</p>
          <p className="mt-2">The hidden message reveals: {challenge.content.solution}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Evidence Categorization */}
          <div>
            <h3 className="font-semibold mb-2">Step 1: Sort Evidence into Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {categories.map(category => (
                <div key={category} className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">{category}</h4>
                  <div className="min-h-40 bg-gray-50 p-2 rounded-md mb-2">
                    {categorizedEvidence[category.toLowerCase() as keyof typeof categorizedEvidence].map(evidence => (
                      <div key={evidence.id} className="bg-white p-2 my-1 rounded border shadow-sm">
                        <p className="text-sm">{evidence.text.substring(0, 60)}...</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Uncategorized Evidence</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categorizedEvidence.uncategorized.map(evidence => (
                  <div 
                    key={evidence.id} 
                    className={`p-3 border rounded-md ${trapTriggered === evidence.id ? 'bg-red-100 border-red-500' : 'bg-white'}`}
                  >
                    <p className="text-sm mb-2">{evidence.text}</p>
                    <div className="flex space-x-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleCategorizeEvidence(evidence, category.toLowerCase())}
                          className="px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                          Add to {category}
                        </button>
                      ))}
                    </div>
                    {trapTriggered === evidence.id && (
                      <p className="text-red-600 mt-2 text-sm">
                        Trap triggered! This is a logical fallacy planted by the Sophist.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Claim-Evidence Matching */}
          <div>
            <h3 className="font-semibold mb-2">Step 2: Match Evidence to Claims</h3>
            {claims.map(claim => (
              <div key={claim.id} className="mb-4 p-4 border rounded-md">
                <h4 className="font-medium mb-2">Claim: {claim.text}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <div key={category} className="p-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium mb-1">{category}</p>
                      
                      {claimEvidence[claim.id]?.[category.toLowerCase() as 'ethos' | 'pathos' | 'logos'] ? (
                        <div className="bg-blue-50 p-2 border border-blue-200 rounded-md text-sm">
                          {claimEvidence[claim.id][category.toLowerCase() as 'ethos' | 'pathos' | 'logos']?.text.substring(0, 60)}...
                        </div>
                      ) : (
                        <div className="p-2 bg-white border rounded-md">
                          <select 
                            className="w-full text-sm p-1 border rounded"
                            onChange={(e) => {
                              const evidenceId = parseInt(e.target.value);
                              const evidence = categorizedEvidence[category.toLowerCase() as keyof typeof categorizedEvidence]
                                .find(ev => ev.id === evidenceId);
                              if (evidence) {
                                assignEvidenceToClaim(
                                  claim, 
                                  evidence, 
                                  category.toLowerCase() as 'ethos' | 'pathos' | 'logos'
                                );
                              }
                            }}
                          >
                            <option value="">Select {category} evidence</option>
                            {categorizedEvidence[category.toLowerCase() as keyof typeof categorizedEvidence].map(evidence => (
                              <option key={evidence.id} value={evidence.id}>
                                Evidence #{evidence.id}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={checkSolution}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Check Solution
          </button>
          
          {isIncorrect && (
            <p className="mt-1 text-sm text-red-600">
              Your solution is not complete. Make sure each claim has all three types of evidence.
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